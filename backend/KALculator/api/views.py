# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import History
from .serializers import HistorySerializer


# Заглушка, которая всегда выдаёт число 732 и статус 200
@api_view(["POST"])
def calculate(request):
    input_str = request.data.get("equation", None)

    if input_str is None:
        return Response({"message": "No equation provided"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"answer": "732"}, status=status.HTTP_200_OK)

# Заглушка для эндпоинта с историей
@api_view(["GET"])
def history(request):
    try:
        history_list = History.objects.all()
        serializer = HistorySerializer(history_list, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Database is unavailable"}, status=status.HTTP_400_BAD_REQUEST)
