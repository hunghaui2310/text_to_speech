
import urllib.request
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TodoSerializer
from .models import Todo, Files
from .serializers import FilesSerializer
from django.conf import settings
from urllib.parse import unquote
from django.http import JsonResponse
import docx
import os
import json

folder_name_origin = 'origin'
folder_name_split = 'split'
folder_name_wav = 'wav'


# Create your views here.
@api_view(['GET'])
def translate(request, file_name, source, target):
    # create folder if not exist
    create_folder_if_not_exist(folder_name_split)  # to save file after splitting
    create_folder_if_not_exist(folder_name_origin)  # to save file origin
    texts = split_text(unquote(file_name))

    return JsonResponse({'text': unquote(texts), 'file_name': unquote(file_name)})


@api_view(['POST'])
def download_wav(request, file_name):
    create_folder_if_not_exist(folder_name_wav)  # to save file wav
    file_path = request.data['url'][14:]
    filename, file_extension = os.path.splitext(file_name)
    urllib.request.urlretrieve("http://studio.ploonet.com/" + file_path,  settings.MEDIA_ROOT + '/' + folder_name_wav + '/' + filename + ".wav")
    return Response('Success')


@api_view(['GET'])
def download(request, file_name):
    file_path = settings.MEDIA_ROOT + '/translated/' + unquote(file_name)
    file_pointer = open(file_path, 'r')
    response = Response(file_pointer,
                        content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation')
    response['Content-Disposition'] = 'attachment; filename=' + unquote(file_name)
    return response


def save_text_to_file(file_name, text):
    prefix_file_name = os.path.splitext(file_name)[0]
    # save file to temp folder in media folder
    file_path = settings.MEDIA_ROOT
    with open(file_path + '/temp/' + prefix_file_name + '.txt', "a") as myfile:
        myfile.write(text.strip() + "\n")


def create_folder_if_not_exist(folder_name):
    # crete folder if not exist in media folder
    if not os.path.exists(settings.MEDIA_ROOT + "/" + folder_name):
        os.mkdir(settings.MEDIA_ROOT + "/" + folder_name)


def split_text(file_name):
    file_path = settings.MEDIA_ROOT
    file_origin_path = file_path + '/' + folder_name_origin + '/' + file_name
    doc = docx.Document(file_origin_path)

    filename, file_extension = os.path.splitext(file_name)
    file_split_path = file_path + '/' + folder_name_split + '/' + filename + '.txt'
    texts = ''
    # create file if doesn't exist
    open(file_split_path, 'w+', encoding='utf-8')
    with open(file_split_path, "a", encoding='utf-8') as myfile:
        for p in doc.paragraphs:
            if len(p.text) != 0:
                texts += p.text
                myfile.write(p.text.strip())
    return texts


def download_file(file_path, name):
    urllib.request.urlretrieve("http://studio.ploonet.com/" + file_path, name + ".wav")

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
