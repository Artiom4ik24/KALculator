from rest_framework import status
from api.models import History
from api.serializers import HistorySerializer
from rest_framework.test import APITestCase
from django.urls import reverse
from unittest.mock import patch
from django.db.utils import OperationalError


class HistoryModelTest(APITestCase):
    def test_create_history_entry(self):
        entry = History.objects.create(equation="1+1000", answer="1001")
        self.assertEqual(entry.equation, "1+1000")
        self.assertEqual(entry.answer, "1001")
        self.assertTrue(entry.id)


class HistorySerializerTest(APITestCase):
    def test_serializer_output(self):
        entry = History.objects.create(equation="(5+2)*3", answer="21")
        serializer = HistorySerializer(entry)
        expected = {
            "id": entry.id,
            "equation": "(5+2)*3",
            "answer": "21",
        }
        self.assertEqual(serializer.data, expected)


class HistoryAPITest(APITestCase):
    def setUp(self):
        self.url = reverse("history")

    def test_history_list_with_data(self):
        History.objects.create(equation="1+1", answer="2")
        History.objects.create(equation="1000-7", answer="993")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["answer"], "2")
        self.assertEqual(data[1]["answer"], "993")

    def test_history_list_empty(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(data, [])

    def test_history_db_failure(self):
        with patch("api.models.History.objects.all", side_effect=OperationalError("DB down")):
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("Database is unavailable", response.json()["message"])

    def test_wrong_method_not_allowed(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_calculate_history_valid_equation(self):
        self.client.post("/calculate/", {"equation": "10-3"}, format="json")
        response = self.client.get(self.url)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["equation"], "10-3")
        self.assertEqual(data[0]["answer"], "7")

    def test_calculate_history_invalid_equation(self):
        self.client.post("/calculate/", {"equation": "(10-3"}, format="json")
        response = self.client.get(self.url)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["equation"], "(10-3")
        self.assertEqual(data[0]["answer"], "Err")

    def test_calculate_history_empty_equation(self):
        self.client.post("/calculate/", {}, format="json")
        response = self.client.get(self.url)

        data = response.json()
        self.assertEqual(data, [])


