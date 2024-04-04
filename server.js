const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Обработка POST-запроса для создания нового файла проекта
app.post('/createProjectFile', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Название проекта не указано');
    }

    const projectFilePath = path.join(__dirname, 'public', 'projects', `${projectName}.json`);
    
    // Проверяем существует ли файл с таким именем
    if (fs.existsSync(projectFilePath)) {
        return res.status(400).send('Файл с таким именем уже существует');
    }

    // Создаем новый файл проекта
    fs.writeFile(projectFilePath, JSON.stringify({}), (err) => {
        if (err) {
            console.error('Ошибка при создании файла проекта:', err);
            return res.status(500).send('Ошибка при создании файла проекта');
        }
        console.log(`Создан новый файл проекта: ${projectName}.json`);
        res.status(200).send('Файл проекта успешно создан');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
