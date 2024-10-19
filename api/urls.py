from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views

urlpatterns = [
    re_path("token/", views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    re_path("register/", views.RegisterView.as_view(), name='register'),
 
    path("employees/", views.employee_list, name="employee_list"),
    path("employees/<int:pk>/", views.employee_detail, name="employee_detail")
]