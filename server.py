import http.server
import socketserver
import csv
import json
import os
from datetime import datetime

PORT = 8000
CSV_FILE = 'signups.csv'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/submit-email':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                email = data.get('email')
                date = datetime.now().isoformat()
                
                if email:
                    # Write to CSV
                    file_exists = os.path.isfile(CSV_FILE)
                    with open(CSV_FILE, 'a', newline='') as f:
                        writer = csv.writer(f)
                        if not file_exists:
                            writer.writerow(['date', 'email'])
                        writer.writerow([date, email])
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'success'}).encode('utf-8'))
                else:
                    self.send_error(400, "Missing email field")
                    
            except Exception as e:
                print(f"Error: {e}")
                self.send_error(500, str(e))
        else:
            self.send_error(404)

print(f"Starting server at http://localhost:{PORT}")
print(f"Signups will be saved to {os.path.abspath(CSV_FILE)}")

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()