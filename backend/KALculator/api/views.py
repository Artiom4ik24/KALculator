# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import History
from .serializers import HistorySerializer
import ast
import operator as op
from django.db import DatabaseError

operators = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.USub: op.neg,   # unary - (e.g., -3)
    ast.UAdd: op.pos,   # unary + (e.g., +5)
}

def eval_expr(expr: str):
    def _eval(node):
        if isinstance(node, ast.Num):  # numbers (Python <=3.7)
            return node.n
        elif isinstance(node, ast.Constant):  # numbers (Python 3.8+)
            return node.value
        elif isinstance(node, ast.BinOp):
            return operators[type(node.op)](_eval(node.left), _eval(node.right))
        elif isinstance(node, ast.UnaryOp):
            return operators[type(node.op)](_eval(node.operand))
        else:
            raise ValueError("Unsupported expression")

    try:
        parsed = ast.parse(expr, mode="eval").body
        return _eval(parsed)
    except Exception:
        raise ValueError("Invalid expression")


# Заглушка, которая всегда выдаёт число 732 и статус 200
@api_view(["POST"])
def calculate(request):
    input_str = request.data.get("equation", None)

    if input_str is None:
        return Response({"message": "No equation provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = eval_expr(input_str)
        if isinstance(result, float):
            # Round to max 9 digits after decimal
            result = round(result, 9)
            # If it's actually an integer (e.g., 4.0 → 4)
            if result.is_integer():
                result = int(result)

        answer = str(result)
        status_code = status.HTTP_200_OK

    except ValueError as e:
        answer = "Invalid expression"
        status_code = status.HTTP_400_BAD_REQUEST

    History.objects.create(equation=input_str, answer=answer)
    return Response(
        {"answer" if status_code == status.HTTP_200_OK else "message": answer}, 
        status=status_code
    )


# Заглушка для эндпоинта с историей
@api_view(["GET"])
def history(request):
    try:
        history_list = History.objects.all()
        serializer = HistorySerializer(history_list, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except DatabaseError:
        return Response({"message": "Database is unavailable"}, status=status.HTTP_400_BAD_REQUEST)
