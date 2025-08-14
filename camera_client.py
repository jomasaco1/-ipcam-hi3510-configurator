import requests
from requests.auth import HTTPBasicAuth
import re

def get_cgi_config(ip, port, username, password, *commands):
    """
    Comunica-se com a câmara IP para obter dados de configuração através de chamadas CGI.

    Args:
        ip (str): O endereço IP da câmara.
        port (int): A porta da câmara.
        username (str): O nome de utilizador para autenticação.
        password (str): A palavra-passe para autenticação.
        *commands (str): Uma lista de comandos CGI a serem executados.
                         Ex: "getlanguage", "getvencattr&-chn=011"

    Returns:
        dict: Um dicionário com os dados de configuração ou uma mensagem de erro.
    """
    # URL ATUALIZADO: Este é um caminho mais comum para o CGI em câmaras com chipset HiSilicon.
    url = f"http://{ip}:{port}/web/cgi-bin/hi3510/param.cgi"
    
    # GESTÃO DE PARÂMETROS MELHORADA:
    # Em vez de construir a string de consulta manualmente, criamos uma lista de tuplos.
    # A biblioteca 'requests' irá formatar e codificar o URL corretamente.
    # Isto lida com múltiplos comandos (ex: ?cmd=getlanguage&cmd=getserverinfo) de forma robusta.
    params = []
    for cmd in commands:
        parts = cmd.split('&')
        command_name = parts[0]
        params.append(('cmd', command_name))
        
        # Adiciona parâmetros específicos do comando, como '-chn=011'
        if len(parts) > 1:
            for param in parts[1:]:
                if '=' in param:
                    key, value = param.split('=', 1)
                    # Remove o '-' inicial se existir (ex: -chn)
                    key = key.lstrip('-')
                    params.append((key, value))

    try:
        response = requests.get(
            url,
            params=params,  # Passamos a lista de parâmetros aqui
            auth=HTTPBasicAuth(username, password),
            timeout=10
        )
        response.raise_for_status()  # Lança uma exceção para códigos de erro HTTP (4xx ou 5xx)
        
        # Parse da resposta e adição do URL final para fins de depuração
        parsed_data = parse_cgi_response(response.text)
        parsed_data["debug_url"] = response.url  # O URL completo que foi efetivamente chamado
        return parsed_data

    except requests.exceptions.RequestException as e:
        # Captura erros de rede, timeout, DNS, etc.
        error_info = {"error": f"Erro de HTTP: {str(e)}"}
        if hasattr(e, 'request') and e.request:
            error_info["debug_url"] = e.request.url
        if hasattr(e, 'response') and e.response is not None:
            error_info["status_code"] = e.response.status_code
        return error_info
        
    except Exception as e:
        # Captura outros erros inesperados
        return {"error": f"Erro Inesperado: {str(e)}"}

def parse_cgi_response(text):
    """
    Analisa a resposta de texto do CGI da câmara e extrai as variáveis.
    A resposta é geralmente um conjunto de declarações de variáveis JavaScript.
    Ex: var model="IPC-123";

    Args:
        text (str): O conteúdo de texto da resposta HTTP.

    Returns:
        dict: Um dicionário com os pares chave-valor extraídos.
    """
    result = {}
    # Expressão regular para encontrar padrões como: var nome_variavel="valor";
    pattern = re.compile(r'var\s+([\w\d_]+)\s*=\s*"?([^";\n]+)"?;?')
    
    for line in text.splitlines():
        match = pattern.search(line)
        if match:
            key = match.group(1)
            value = match.group(2).strip('"') # Remove aspas do valor
            result[key] = value
            
    return result
