document.addEventListener('DOMContentLoaded', function() {
    // ======== LÓGICA PARA EL CAMBIO DE TEMA (MODO OSCURO/CLARO) ========
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = '<i class="fas fa-sun"></i>';
    const moonIcon = '<i class="fas fa-moon"></i>';

    // Función para aplicar el tema
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggleBtn.innerHTML = moonIcon; // Mostrar luna si está en modo claro
        } else {
            body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = sunIcon; // Mostrar sol si está en modo oscuro
        }
    }

    // Cargar el tema guardado en localStorage o preferencia del sistema
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        // Si no hay tema guardado, usar la preferencia del sistema
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);

    // Event listener para el botón de cambio de tema
    themeToggleBtn.addEventListener('click', function() {
        if (body.classList.contains('light-mode')) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });

    // Escuchar cambios en la preferencia del sistema (si el usuario no ha elegido manualmente)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Solo cambiar si no hay una preferencia explícita en localStorage
        if (!localStorage.getItem('theme')) {
            const newColorScheme = e.matches ? "dark" : "light";
            applyTheme(newColorScheme);
        }
    });

    // ======== ANIMACIÓN DE CARDS AL HACER SCROLL (INTERSECTION OBSERVER) ========
    const animatedCards = document.querySelectorAll('.animated-card');

    const observerOptions = {
        root: null, // El viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% de la card visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: dejar de observar una vez que la animación ha ocurrido
                // observer.unobserve(entry.target);
            } else {
                // Opcional: remover la clase si quieres que la animación se repita al scrollear arriba/abajo
                 entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    animatedCards.forEach(card => {
        observer.observe(card);
    });

    // ======== SMOOTH SCROLL PARA ENLACES DEL NAVBAR (COMPLEMENTARIO AL CSS) ========
    // Bootstrap 5 ya maneja el scroll suave para anclas si `scroll-behavior: smooth;` está en html/body.
    // Pero si quieres más control o compatibilidad, podrías añadir esto:
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevenir el comportamiento por defecto solo si es un enlace de ancla interno
            if (this.hash !== "") {
                // No es necesario e.preventDefault() si se usa scroll-behavior: smooth
                // y no hay otros scripts interfiriendo.
                // Bootstrap se encarga de cerrar el menú en móviles.
            }
        });
    });

    // Opcional: Activar el enlace del navbar correspondiente a la sección visible
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Ajustar el offsetTop para considerar el navbar fijo y un pequeño margen
            const sectionTop = current.offsetTop - 100; // 70px del navbar + 30px de margen
            let sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    navHighlighter(); // Llamar una vez al cargar para resaltar la sección inicial si es necesario

}); // Fin de DOMContentLoaded