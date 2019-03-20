#!/usr/bin/env python
import json
import os
import numpy as np
import tensorflow as tf
import model, sample, encoder

from urllib.parse import urlparse, parse_qsl
from http.server import BaseHTTPRequestHandler, HTTPServer

def get_text(
    text,
    length=None,
    model_name='117M',
    seed=None,
    nsamples=1,
    batch_size=1,
    temperature=1,
    top_k=40,
):
    print('Generating text for input "%s"...' % text)
    if batch_size is None:
        batch_size = 1
    assert nsamples % batch_size == 0

    enc = encoder.get_encoder(model_name)
    hparams = model.default_hparams()
    with open(os.path.join('models', model_name, 'hparams.json')) as f:
        hparams.override_from_dict(json.load(f))

    if length is None:
        length = hparams.n_ctx // 2
    elif length > hparams.n_ctx:
        raise ValueError("Can't get samples longer than window size: %s" % hparams.n_ctx)

    with tf.Session(graph=tf.Graph()) as sess:
        context = tf.placeholder(tf.int32, [batch_size, None])
        np.random.seed(seed)
        tf.set_random_seed(seed)
        output = sample.sample_sequence(
            hparams=hparams, length=length,
            context=context,
            batch_size=batch_size,
            temperature=temperature, top_k=top_k
        )

        saver = tf.train.Saver()
        ckpt = tf.train.latest_checkpoint(os.path.join('models', model_name))
        saver.restore(sess, ckpt)

        context_tokens = enc.encode(text)
        generated = 0
        for _ in range(nsamples // batch_size):
            out = sess.run(output, feed_dict={
                context: [context_tokens for _ in range(batch_size)]
            })[:, len(context_tokens):]
            for i in range(batch_size):
                generated += 1
                text = enc.decode(out[i])
                return text

class server(BaseHTTPRequestHandler): 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        query_str = urlparse(self.path).query
        query = dict(parse_qsl(query_str))
        if 'q' in query:
            q = query['q']
            data = {
              'input': q,
              'output': get_text(q, 100)
            }
        else:
            data = {}
        json_string = json.dumps(data)
        self.wfile.write(bytes(json_string, 'utf-8'))
        return
 
def run():
    port = int(os.environ.get('PORT', 8080))
    server_address = ('', port)
    httpd = HTTPServer(server_address, server)
    print('Running server on port %d...' % port)
    httpd.serve_forever()
 
run()