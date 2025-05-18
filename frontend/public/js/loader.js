// Função para mostrar o loader
function showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('show');
    }
}

// Função para esconder o loader
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.remove('show');
    }
}

// Exportar as funções para uso global
window.showLoader = showLoader;
window.hideLoader = hideLoader; 