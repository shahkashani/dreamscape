FROM tensorflow/tensorflow:1.12.0-py3

ENV LANG=C.UTF-8
RUN mkdir /gpt-2
WORKDIR /gpt-2

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/graykode/gpt-2-Pytorch
WORKDIR gpt-2-Pytorch

RUN curl --output gpt2-pytorch_model.bin https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-pytorch_model.bin
RUN pip3 install -r requirements.txt
RUN pip3 install torchvision tqdm

