# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


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
    dummy = [
        {
            "equation": "2+2",
            "answer": "4"
        },
        {
            "equation": "5/0",
            "answer": "ERR"
        }
    ]

    return Response(dummy, status=status.HTTP_200_OK)
