/**
 * main.js
 * * Este ficheiro contém toda a lógica do lado do cliente para a aplicação de gestão de câmaras.
 * É responsável por:
 * - Carregar e exibir a lista de câmaras.
 * - Adicionar uma nova câmara através do formulário.
 * - Apagar câmaras existentes.
 * - Mudar para a vista de configuração de uma câmara.
 * - Gerir a navegação por abas (Sistema, Rede, etc.).
 * - Pedir os dados de configuração ao backend e exibi-los de forma legível,
 * utilizando os metadados definidos em `metadata.js`.
 */

// Espera que todo o conteúdo da página (DOM) seja carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos do DOM ---
    const cameraForm = document.getElementById('addCameraForm');
    const camerasTableBody = document.getElementById('camerasTableBody');
    const cameraListView = document.getElementById('cameraList');
    const configView = document.getElementById('configView');
    const backButton = document.getElementById('backButton');
    const cameraNameSpan = document.getElementById('cameraName');
    const mainTabs = document.querySelector('.tabs');

    // --- Variável para guardar o estado ---
    let currentCameraId = null;

    // --- Funções Principais ---

    /**
     * Busca a lista de câmaras no servidor e renderiza-a na tabela.
     */
    const fetchAndRenderCameras = async () => {
        try {
            const response = await fetch('/cameras');
            if (!response.ok) {
                throw new Error('Falha ao carregar câmaras.');
            }
            const cameras = await response.json();
            
            camerasTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas

            cameras.forEach(camera => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${camera.id}</td>
                    <td>${camera.name}</td>
                    <td>${camera.ip}</td>
                    <td>${camera.port}</td>
                    <td>
                        <button class="config-btn" data-id="${camera.id}" data-name="${camera.name}"><i class="fas fa-cog"></i> Configurar</button>
                        <button class="delete-btn" data-id="${camera.id}"><i class="fas fa-trash"></i> Apagar</button>
                    </td>
                `;
                camerasTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
            camerasTableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar câmaras.</td></tr>';
        }
    };

    /**
     * Adiciona uma nova câmara.
     * @param {Event} e - O evento de submissão do formulário.
     */
    const addCamera = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        
        const newCamera = {
            name: document.getElementById('name').value,
            ip: document.getElementById('ip').value,
            port: parseInt(document.getElementById('port').value, 10),
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };

        try {
            const response = await fetch('/cameras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCamera),
            });

            if (!response.ok) {
                throw new Error('Falha ao adicionar câmara.');
            }
            
            cameraForm.reset(); // Limpa o formulário
            fetchAndRenderCameras(); // Atualiza a lista de câmaras
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível adicionar a câmara.');
        }
    };

    /**
     * Apaga uma câmara.
     * @param {number} id - O ID da câmara a ser apagada.
     */
    const deleteCamera = async (id) => {
        // Confirmação simples para evitar apagar acidentalmente
        if (!confirm('Tem a certeza que deseja apagar esta câmara?')) {
            return;
        }

        try {
            const response = await fetch(`/cameras/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Falha ao apagar câmara.');
            }
            fetchAndRenderCameras(); // Atualiza a lista
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível apagar a câmara.');
        }
    };

    /**
     * Busca e renderiza os dados de configuração para uma categoria específica.
     * @param {string} category - A categoria a ser carregada (ex: 'system', 'network').
     */
    const fetchAndRenderConfig = async (category) => {
        if (!currentCameraId) return;

        const tabPane = document.getElementById(`${category}-tab`);
        const subTabContent = tabPane.querySelector('.sub-tab-content');
        subTabContent.innerHTML = '<p>A carregar...</p>'; // Mostra um feedback de carregamento

        try {
            const response = await fetch(`/config/${currentCameraId}?category=${category}`);
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Erro desconhecido');
            }
            
            renderConfigData(category, data);

        } catch (error) {
            console.error(`Erro ao carregar configuração para ${category}:`, error);
            subTabContent.innerHTML = `<div class="error"><strong>Erro:</strong> ${error.message}</div>`;
        }
    };

    /**
     * Renderiza os dados de configuração numa tabela, usando os metadados.
     * @param {string} category - A categoria dos dados.
     * @param {object} data - Os dados recebidos do servidor.
     */
    const renderConfigData = (category, data) => {
        const categoryMeta = metadata[category];
        const tabPane = document.getElementById(`${category}-tab`);
        const subTabContent = tabPane.querySelector('.sub-tab-content');
        subTabContent.innerHTML = ''; // Limpa o conteúdo anterior

        // Adiciona a URL de depuração, se existir
        if (data.debug_url) {
            subTabContent.innerHTML += `<div class="info"><strong>URL de Depuração:</strong> ${data.debug_url}</div>`;
        }

        categoryMeta.groups.forEach(group => {
            const groupContainer = document.createElement('div');
            groupContainer.innerHTML = `<h3>${group.title}</h3>`;

            const table = document.createElement('table');
            table.className = 'config-table';
            const tbody = document.createElement('tbody');

            group.variables.forEach(variableKey => {
                const fullVarKey = group.prefix ? `${variableKey}${group.prefix}` : variableKey;
                const value = data[fullVarKey] !== undefined ? data[fullVarKey] : 'N/A';
                const description = variableDescriptions[fullVarKey] || 'Descrição não disponível.';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="param-name" title="${description}">${variableKey}</td>
                    <td class="param-value">${value}</td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            groupContainer.appendChild(table);
            subTabContent.appendChild(groupContainer);
        });
    };

    /**
     * Mostra a vista de configuração e esconde a lista de câmaras.
     * @param {number} id - O ID da câmara selecionada.
     * @param {string} name - O nome da câmara selecionada.
     */
    const showConfigView = (id, name) => {
        currentCameraId = id;
        cameraNameSpan.textContent = name;
        cameraListView.style.display = 'none';
        cameraForm.style.display = 'none';
        configView.style.display = 'block';

        // Ativa a primeira aba por defeito e carrega os seus dados
        mainTabs.querySelector('.tab-button.active').classList.remove('active');
        document.querySelector('.tab-pane.active').classList.remove('active');
        
        const firstTab = mainTabs.querySelector('.tab-button');
        firstTab.classList.add('active');
        document.getElementById(`${firstTab.dataset.tab}-tab`).classList.add('active');
        
        fetchAndRenderConfig(firstTab.dataset.tab);
    };

    /**
     * Mostra a lista de câmaras e esconde a vista de configuração.
     */
    const showListView = () => {
        currentCameraId = null;
        configView.style.display = 'none';
        cameraListView.style.display = 'block';
        cameraForm.style.display = 'block';
    };


    // --- Event Listeners ---

    // Adicionar câmara
    cameraForm.addEventListener('submit', addCamera);

    // Clicar nos botões "Configurar" ou "Apagar" (usando delegação de eventos)
    camerasTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains('delete-btn')) {
            deleteCamera(id);
        } else if (target.classList.contains('config-btn')) {
            const name = target.dataset.name;
            showConfigView(id, name);
        }
    });

    // Voltar para a lista de câmaras
    backButton.addEventListener('click', showListView);

    // Mudar de aba na vista de configuração
    mainTabs.addEventListener('click', (e) => {
        const target = e.target.closest('.tab-button');
        if (!target) return;

        // Atualiza o estilo da aba ativa
        mainTabs.querySelector('.tab-button.active').classList.remove('active');
        target.classList.add('active');

        // Mostra o painel de conteúdo correspondente
        document.querySelector('.tab-pane.active').classList.remove('active');
        const category = target.dataset.tab;
        document.getElementById(`${category}-tab`).classList.add('active');

        // Carrega os dados para a nova aba
        fetchAndRenderConfig(category);
    });

    // --- Inicialização ---
    // Carrega as câmaras quando a página é aberta pela primeira vez.
    fetchAndRenderCameras();
});
