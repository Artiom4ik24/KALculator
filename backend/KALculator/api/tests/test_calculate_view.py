# api/tests.py
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class CalculateViewTests(APITestCase):
    def setUp(self):
        self.url = reverse("calculate")

    def test_calculate_success_simple(self):
        resp = self.client.post(self.url, {"equation": "2+2"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["answer"] == "4"

    def test_calculate_success_round_float(self):
        resp = self.client.post(self.url, {"equation": "2.3+3.7"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["answer"] == "6"

    def test_calculate_success_long(self):
        resp = self.client.post(self.url, {"equation": "10/3"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["answer"] == "3.333333333"

    def test_calculate_parentheses_and_precedence(self):
        resp = self.client.post(self.url, {"equation": "(2+3)*4-6/2"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["answer"] in {"17.0", "17"}  # depending on float/int

    def test_calculate_unary(self):
        resp = self.client.post(self.url, {"equation": "-(5+3)"}, format="json")
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["answer"] in {"-8", "-8.0"}

    def test_calculate_invalid_brackets(self):
        resp = self.client.post(self.url, {"equation": "((2+3)"}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        # message text depends on your eval function; check for key
        assert "message" in resp.data

        resp = self.client.post(self.url, {"equation": "1/0"}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        # message text depends on your eval function; check for key
        assert "message" in resp.data


    def test_calculate_invalid_expression(self):
        resp = self.client.post(self.url, {"equation": "2+foo"}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        # message text depends on your eval function; check for key
        assert "message" in resp.data

    def test_calculate_missing_equation(self):
        resp = self.client.post(self.url, {}, format="json")
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "No equation provided"

    def test_wrong_method_not_allowed(self):
        resp = self.client.get(self.url)
        assert resp.status_code == status.HTTP_405_METHOD_NOT_ALLOWED