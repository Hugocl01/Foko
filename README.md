# Foko 📸

Foko es una aplicación web diseñada para fotógrafos y entusiastas de la fotografía que buscan un espacio para exponer sus obras, publicitarse como creadores y compartir tanto trabajos comerciales como artísticos. Además, los usuarios pueden vender y adquirir presets de edición fotográfica.

La aplicación permite a los fotógrafos crear un portafolio en línea, donde pueden mostrar sus mejores trabajos y compartir su estilo único con el mundo. Los usuarios también pueden seguir a otros fotógrafos, interactuar con sus publicaciones y descubrir nuevas tendencias en la fotografía.

## Tecnologías utilizadas 🛠️

+ Backend: Laravel 12
+ Frontend: Inertia.js + React.js
+ Base de datos: MySQL

## Requisitos previos ⚙️

Antes de comenzar asegúrate de tener instalado:

+ PHP >= 8.2
+ Composer
+ Node.js >= 18.x
+ MySQL o MariaDB
+ NPM

## Instalación 🚀

1. Clona el repositorio, recomendacion clonarlo en xampp/htdocs:

```bash
git clone https://github.com/Hugocl01/Foko.git
```

2. Instala las dependencias de PHP:

```bash
composer install
```

3. Instala las dependencias de JavaScript:

```bash
npm install
```

4. Copia el archivo `.env.example` a `.env` y configura tus credenciales de base de datos:

```bash
cp .env.example .env
```

5. Genera la clave de la aplicación:

```bash
php artisan key:generate
```

6. Ejecuta las migraciones y si lo deseas, los seeders para poblar la base de datos con datos de ejemplo:

```bash
php artisan migrate:fresh --seed
```

7. Compila los assets de JavaScript y CSS:

```bash
npm run build
```

8. Inicia el servidor de desarrollo:

```bash
php artisan serve
```

9. Abre tu navegador y visita `http://localhost:8000` para ver la aplicación en funcionamiento.

