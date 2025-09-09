# KALculator
A project dedicated to teach MCS students how to work as a one big beautiful team. Only for smart people.

# ВАЖНО
Для каждой задачи создавайте отдельную ветку и используйте ветку своего направления (frontend/backend) в качестве базовой

# Backend
## Quickstart
Этот блок для запуска проекта. Если проект у вас ещё не развёрнут, см. "Инструкции по установке"

1. Активируем наше виртуальное окружение
2. ``python manage.py runserver``

## Инструкции по установке

1. Создать и активировать виртуальное питоновское окружение в папке backend (рекомендую python >= 1.12, с ним точно работает, на остальных не проверял)
2. ``cd backend/KALculator``
3. ``pip install -r requirements.txt``
4. ``python manage.py migrate`` (**проверьте, что виртуальное окружение активно**)
5. ``python manage.py createsuperuser --username admin --email admin@example.com `` (создали пользователя для с таким username и паролем на случай если надо будет получить доступ к админской панели)
6. ``python manage.py runserver``


# Frontend
## Quickstart
Этот блок для запуска проекта. Если проект у вас ещё не развёрнут, см. "Инструкции по установке"

1. ``npm run preview``

## Инструкции по установке

1. Убедитесь, что у вас установлены Node.js.
C помощью ``node --version`` проверьте, что у вас v20.x.x
2. Перейдите в папку ``frontend``, в которой расположены ``package.json`` и ``vite.config.js``
3. Выполнить команду ``npm install``, чтобы установить все необходимые библиотеки
4. ``npm run build``
5. ``npm run preview``
