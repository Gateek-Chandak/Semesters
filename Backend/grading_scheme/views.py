from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from grading_scheme.utils.main import create_course_grading_schemes


class PDFUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser] 

    def post(self, request):
        # Extract the uploaded file
        uploaded_file = request.FILES['pdf']
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=400)

        grading_scheme_data = create_course_grading_schemes(uploaded_file)
        if not isinstance(grading_scheme_data, dict) and (grading_scheme_data != "no grading scheme found"):
            return Response({"error": "Invalid data returned from PDF processing"}, status=400)

        return Response(grading_scheme_data, status=200)