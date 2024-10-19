import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from datetime import date, datetime

# Create your models here.

class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Include username since it is now mandatory

    def __str__(self):
        return f'{self.username} - {self.email}'
    

class Employee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField(null=True, blank = True)
    profile_pic = models.CharField(max_length = 10000, default='Profile Picture Set', null = True, blank = True)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    salary = models.PositiveIntegerField(default=0, null=True, blank=True)
    age = models.IntegerField(null=True, blank = True)
    bio = models.TextField(blank=True, null=True)
    email = models.EmailField(null=True, blank=True, default = 'employee@gmail.com')
    phone_number = models.CharField(max_length=20, null=True, blank = True)
    
    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def save(self, *args, **kwargs):
        try:
            dob = datetime.strptime(str(self.date_of_birth), '%Y-%m-%d').date()
            today = datetime.now().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            self.age = age
        except (ValueError, TypeError):
            self.age = None

    

       

          
        if self.gender == "Male": 
            self.profile_pic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGoq0pRWVWx2I7NKX-D4miLJq4HG-iSqwmJw&s'
        elif self.gender == "Female":
            self.profile_pic = 'https://thumbs.dreamstime.com/b/portrait-woman-character-avatar-employee-icon-vector-illustration-portrait-woman-character-avatar-employee-icon-112051717.jpg'
     


        super(Employee, self).save(*args, **kwargs)
