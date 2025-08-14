from flask import Flask, jsonify, request, render_template
import sqlite3
from camera_client import get_cgi_config

app = Flask(__name__)

# Armazenamento em SQLite
def init_db():
    conn = sqlite3.connect('cameras.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS cameras
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  ip TEXT,
                  port INTEGER,
                  username TEXT,
                  password TEXT)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cameras', methods=['GET'])
def get_cameras():
    conn = sqlite3.connect('cameras.db')
    c = conn.cursor()
    c.execute("SELECT * FROM cameras")
    cameras = [{
        'id': row[0],
        'name': row[1],
        'ip': row[2],
        'port': row[3],
        'username': row[4],
        'password': row[5]
    } for row in c.fetchall()]
    conn.close()
    return jsonify(cameras)

@app.route('/cameras', methods=['POST'])
def add_camera():
    data = request.json
    conn = sqlite3.connect('cameras.db')
    c = conn.cursor()
    c.execute("INSERT INTO cameras (name, ip, port, username, password) VALUES (?, ?, ?, ?, ?)",
              (data['name'], data['ip'], data['port'], data['username'], data['password']))
    conn.commit()
    camera_id = c.lastrowid
    conn.close()
    return jsonify({'id': camera_id})

@app.route('/config/<int:camera_id>', methods=['GET'])
def get_config(camera_id):
    category = request.args.get('category', 'system')
    
    conn = sqlite3.connect('cameras.db')
    c = conn.cursor()
    c.execute("SELECT * FROM cameras WHERE id=?", (camera_id,))
    camera = c.fetchone()
    conn.close()
    
    if not camera:
        return jsonify({"error": "Camera not found"}), 404

    # Comandos por categoria
    category_commands = {
        'system': [
            'getlanguage',
            'getserverinfo',
            'getdevtype',
            'getossattr',
            'getsystemtime',
            'getupnpattr'
        ],
        'network': [
            'getnetattr',
            'getwirelessattr',
            'getportattr',
            'getddnsattr'
        ],
        'video': [
            'getvencattr&-chn=011',  # Fluxo principal
            'getvencattr&-chn=012',  # Fluxo secundário
            'getvideoattr',
            'getimagemaxsize',
            'getmobilesnapattr',
            'getimageattr'
        ],
        'audio': [
            'getaencattr&-chn=011',
            'getaencattr&-chn=012',
            'getaudioinvolume',
            'getaudiooutvolume'
        ],
        'ptz': [
            'getptzspeed',
            'getptzpreset',
            'getptztour',
            'getptzlimit'
        ],
        'detection': [
            'getmotionalarmattr',
            'getaudioalarmattr',
            'getsmartdetectattr'
        ],
        'nightvision': [
            'getlightattr',
            'getircutattr',
            'getexposureattr'
        ]
    }
    
    # Se categoria inválida
    if category not in category_commands:
        return jsonify({"error": "Categoria inválida"}), 400
    
    # Executar comandos em lote
    try:
        config_data = get_cgi_config(
            camera[2], camera[3], camera[4], camera[5],
            *category_commands[category]
        )
        
        return jsonify(config_data)
        
    except Exception as e:
        return jsonify({
            "error": f"Erro interno: {str(e)}"
        }), 500
        

@app.route('/cameras/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    conn = sqlite3.connect('cameras.db')
    c = conn.cursor()
    c.execute("SELECT * FROM cameras WHERE id=?", (camera_id,))
    camera = c.fetchone()
    
    if not camera:
        return jsonify({"error": "Camera not found"}), 404
    
    c.execute("DELETE FROM cameras WHERE id=?", (camera_id,))
    conn.commit()
    rows_affected = c.rowcount
    conn.close()
    
    if rows_affected > 0:
        return jsonify({"success": True, "message": "Camera deleted successfully"})
    else:
        return jsonify({"error": "Failed to delete camera"}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)