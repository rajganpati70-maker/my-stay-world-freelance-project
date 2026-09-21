from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class ReuseHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 5000), ReuseHandler).serve_forever()