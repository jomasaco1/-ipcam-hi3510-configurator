// static/js/metadata.js
const metadata = {
    system: {
        title: "Sistema",
        commands: [
            "getlanguage",
            "getserverinfo",
            "getdevtype",
            "getossattr",
            "getservertime",
            "getupnpattr"
        ],
        groups: [
            {
                title: "Informações Gerais",
                variables: ["model", "hardVersion", "softVersion", "webVersion", "rs485Version", "name", "devtype"]
            },
            {
                title: "Status",
                variables: ["upnpstatus", "facddnsstatus", "th3ddnsstatus", "platformstatus", "sdstatus"]
            },
            {
                title: "Armazenamento",
                variables: ["sdfreespace", "sdtotalspace", "oss_exptime", "oss_totalsize", "oss_usedsize", "oss_freesize"]
            }
        ]
    },
    network: {
        title: "Rede",
        commands: [
            'getnetattr',
    'getwirelessattr',
    'gethttpport',
    'getrtspport',    
    'getourddnsattr',
    'get3thddnsattr'
        ],
        groups: [
            {
                title: "Configurações IP",
                variables: ["dhcpflag", "ip", "netmask", "gateway", "dnsstat", "fdnsip", "sdnsip"]
            },
            {
                title: "Wireless",
                variables: ["wf_enable", "wf_ssid", "wf_auth", "wf_enc", "wf_mode", "chkres"]
            },
            {
                title: "Portas",
                variables: ["httpport", "rtspport", "rtpport", "rtmpport", "rtsp_aenable"]
            },
            {
                title: "DDNS",
                variables: ["our_enable", "our_server", "our_port", "our_uname", "our_passwd", "our_domain", "our_interval"]
            }
        ]
    },
    video: {
        title: "Vídeo",
        commands: [
            "getvencattr&-chn=011",  // Fluxo principal
            "getvencattr&-chn=012",  // Fluxo secundário
            "getvideoattr",
            "getimagemaxsize",
            "getmobilesnapattr",
            "getimageattr"
        ],
        groups: [
            {
                title: "Fluxo Principal",
                prefix: "_1",
                variables: ["width", "height", "bps", "fps", "gop", "brmode", "imagegrade"]
            },
            {
                title: "Fluxo Secundário",
                prefix: "_2",
                variables: ["width", "height", "bps", "fps", "gop", "brmode", "imagegrade"]
            },
            {
                title: "Configurações de Imagem",
                variables: ["brightness", "contrast", "saturation", "hue", "wdr", "night"]
            }
        ]
    },
    audio: {
        title: "Áudio",
        commands: [
            "getaudioinvolume",
            "getaudiooutvolume"
        ],
        groups: [
            {
                title: "Configurações Gerais",
                variables: ["audioflag", "volin_type", "volume"]
            },
            {
                title: "Processamento",
                variables: ["aec", "denoise", "ao_volume"]
            }
        ]
    },
    ptz: {
        title: "PTZ",
        commands: [
            "getptzspeed"
        ],
        groups: [
            {
                title: "Controle",
                variables: ["panspeed", "tiltspeed", "pandir", "tiltdir"]
            },
            {
                title: "Limites",
                variables: ["limitleft", "limitright", "panhome", "tilthome"]
            },
            {
                title: "Automação",
                variables: ["panscan", "tiltscan", "movehome"]
            }
        ]
    },
    detection: {
        title: "Detecção",
        commands: [
            "getaudioalarmattr"
        ],
        groups: [
            {
                title: "Movimento",
                variables: ["m1_enable", "m1_sensitivity", "m1_threshold"]
            },
            {
                title: "Áudio",
                variables: ["aa_enable", "aa_value"]
            },
            {
                title: "Inteligente",
                variables: ["smd_enable", "smd_threshold"]
            }
        ]
    },
    nightvision: {
        title: "Visão Noturna",
        commands: [
            "getlightattr",
            "getircutattr"
        ],
        groups: [
            {
                title: "IR",
                variables: ["light_enable", "saradc_switch_value", "saradc_b2c_switch_value"]
            },
            {
                title: "Exposição",
                variables: ["shutter", "ae", "targety"]
            }
        ]
    }
};

// Descrições completas das variáveis
const variableDescriptions = {
    "model": "Modelo interno do hardware",
    "hardVersion": "Versão do hardware",
    "softVersion": "Versão do firmware (contém data compilação -YYYYMMDD)",
    "webVersion": "Versão da interface web",
    "rs485Version": "Versão do protocolo RS485",
    "name": "Nome do dispositivo",
    "upnpstatus": "Status UPnP (on/off)",
    "facddnsstatus": "Status DDNS do fabricante (on/off)",
    "th3ddnsstatus": "Status DDNS de terceiros (on/off)",
    "platformstatus": "Status da plataforma P2P (0=desativado)",
    "sdstatus": "Status do cartão SD (Ready/No Card/Full/Error)",
    "sdfreespace": "Espaço livre no SD (KB)",
    "sdtotalspace": "Espaço total do SD (KB)",
    "dhcpflag": "Modo DHCP. Valores: 'on' (DHCP ativo), 'off' (IP estático)",
    "ip": "Endereço IP. Formato: XXX.XXX.XXX.XXX",
    "netmask": "Máscara de rede. Formato: XXX.XXX.XXX.XXX",
    "gateway": "Gateway padrão. Formato: XXX.XXX.XXX.XXX",
    "dnsstat": "Modo DNS: '1'=Automático, '0'=Manual",
    "fdnsip": "DNS primário. Formato: XXX.XXX.XXX.XXX (pode ser vazio)",
    "sdnsip": "DNS secundário. Formato: XXX.XXX.XXX.XXX (pode ser vazio)",
    "wf_enable": "Status de habilitação do Wi-Fi: '0'=desligado, '1'=ligado",
    "wf_ssid": "Nome da rede Wi-Fi (SSID). Comprimento máximo: 63 caracteres",
    "wf_auth": "Método de autenticação: '0'=Nenhum, '1'=WEP, '2'=WPA-PSK, '3'=WPA2-PSK",
    "wf_enc": "Tipo de criptografia: '0'=TKIP, '1'=AES",
    "wf_mode": "Modo de operação: '0'=Infraestrutura, '1'=P2P",
    "chkres": "Resultado do teste Wi-Fi: '0'=falha, '1'=sucesso",
    "httpport": "Porta HTTP. Valores: 80 ou 1024-49151",
    "rtspport": "Porta RTSP. Valores: 554 ou 1024-49151",
    "rtpport": "Porta RTP. Valores: 1024-65535",
    "rtmpport": "Porta RTMP. Valores: 1935 ou 1024-49151",
    "rtsp_aenable": "Autenticação RTSP: '0'=desligada, '1'=ligada",
    "our_enable": "Status DDNS: '0'=desligado, '1'=ligado",
    "our_server": "Servidor DDNS (ex: 'hipcam.org')",
    "our_port": "Porta do servidor (normalmente 80)",
    "width_1": "Largura do vídeo em pixels (fluxo primário)",
    "height_1": "Altura do vídeo em pixels (fluxo primário)",
    "bps_1": "Taxa de bits em kbps (32-8192 para fluxo primário)",
    "fps_1": "Quadros por segundo (1-30)",
    "gop_1": "Intervalo de quadros-chave/GOP (2-150 frames)",
    "brmode_1": "Modo de controle de taxa (0=CBR, 1=VBR)",
    "imagegrade_1": "Qualidade de imagem (1-6, 1=melhor qualidade)",
    "width_2": "Largura do vídeo em pixels (fluxo secundário)",
    "height_2": "Altura do vídeo em pixels (fluxo secundário)",
    "bps_2": "Taxa de bits em kbps (32-2048 para fluxo secundário)",
    "fps_2": "Quadros por segundo (1-30)",
    "gop_2": "Intervalo de quadros-chave/GOP (2-150 frames)",
    "brmode_2": "Modo de controle de taxa (0=CBR, 1=VBR)",
    "imagegrade_2": "Qualidade de imagem (1-6, 1=melhor qualidade)",
    "brightness": "Brilho da imagem (0–100)",
    "contrast": "Contraste da imagem (0–100)",
    "saturation": "Saturação da cor (valor numérico, ex: 106)",
    "hue": "Matiz de cor (0–100)",
    "wdr": "Wide Dynamic Range (on/off)",
    "night": "Modo noturno (on/off)",
    "audioflag": "Status do áudio (0=desligado, 1=ligado)",
    "volin_type": "Fonte áudio. Valores: 0=Line-in, 1=Microfone",
    "volume": "Volume entrada. Limites: 1-100",
    "aec": "Cancelamento eco. Valores: 0=desligado, 1=ligado",
    "denoise": "Redução ruído. Valores: 0=desligado, 1=ligado",
    "ao_volume": "Volume saída. Limites: 1-100",
    "panspeed": "Velocidade do movimento horizontal (0=rápido, 1=médio, 2=lento)",
    "tiltspeed": "Velocidade do movimento vertical (0=rápido, 1=médio, 2=lento)",
    "pandir": "Direção horizontal (0=normal, 1=invertida)",
    "tiltdir": "Direção vertical (0=normal, 1=invertida)",
    "limitleft": "Limite angular esquerdo para movimento (-1=ilimitado ou ângulo)",
    "limitright": "Limite angular direito para movimento (-1=ilimitado ou ângulo)",
    "panhome": "Posição horizontal 'home' do motor",
    "tilthome": "Posição vertical 'home' do motor",
    "panscan": "Ativa/desativa varredura horizontal automática (0=desligado, 1=ligado)",
    "tiltscan": "Número de ciclos de varredura vertical (1-50, 0=desativado)",
    "movehome": "Centraliza a câmera na posição inicial ao reiniciar (on/off)",
    "m1_enable": "Estado da Área 1 de detecção de movimento: 0=Desativada, 1=Ativada",
    "m1_sensitivity": "Sensibilidade ao movimento (1-100): 1=objetos grandes, 100=objetos pequenos",
    "m1_threshold": "Limiar de mudança de pixels (0-255): Diferença mínima de intensidade para detecção",
    "aa_enable": "Habilita alarme de áudio (0=desligado, 1=ligado)",
    "aa_value": "Sensibilidade do microfone para alarme (0-100)",
    "smd_enable": "Habilita detecção inteligente (0/1)",
    "smd_threshold": "Limiar de detecção inteligente (0-255)",
    "infraredstat": "Estado do IR (close=desligado, open=ligado)",
    "lamp_mode": "Modo de controle da lâmpada (0=manual, 1=auto, 2=timer)",
    "lamp_timeout": "Tempo de desligamento automático em segundos",
    "shutter": "Velocidade do obturador em microssegundos",
    "ae": "Modo de exposição automática (0, 1, 2... depende do modelo)",
    "targety": "Brilho alvo da exposição (ex: 70)"
};

// Adicionar descrições aos grupos
for (const category in metadata) {
    for (const group of metadata[category].groups) {
        group.descriptions = {};
        for (const variable of group.variables) {
            const fullVar = group.prefix ? variable + group.prefix : variable;
            group.descriptions[fullVar] = variableDescriptions[fullVar] || "Descrição não disponível";
        }
    }
}
