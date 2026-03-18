// Sistema de armazenamento de dados
const GameData = {
    users: [],
    rankings: [],
    
    init() {
        // Carregar dados do localStorage
        const savedUsers = localStorage.getItem('geo_vibes_users');
        const savedRankings = localStorage.getItem('geo_vibes_rankings');
        
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
        
        if (savedRankings) {
            this.rankings = JSON.parse(savedRankings);
        } else {
            // Ranking inicial com alguns jogadores fictícios
            this.rankings = [
                { name: 'Ana Silva', score: 18, lastPlayed: new Date().toISOString() },
                { name: 'Carlos Santos', score: 15, lastPlayed: new Date().toISOString() },
                { name: 'Mariana Lima', score: 12, lastPlayed: new Date().toISOString() },
                { name: 'João Pereira', score: 9, lastPlayed: new Date().toISOString() },
                { name: 'Patrícia Costa', score: 6, lastPlayed: new Date().toISOString() }
            ];
            this.saveRankings();
        }
    },
    
    saveUsers() {
        localStorage.setItem('geo_vibes_users', JSON.stringify(this.users));
    },
    
    saveRankings() {
        localStorage.setItem('geo_vibes_rankings', JSON.stringify(this.rankings));
    },
    
    registerUser(username) {
        if (this.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return false; // Usuário já existe
        }
        
        const user = {
            username: username,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(user);
        this.saveUsers();
        return true;
    },
    
    loginUser(username) {
        const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        return user || { username: username, isGuest: true };
    },
    
    addScore(username, score, consecutiveBonus = 0) {
        const existing = this.rankings.find(r => r.name.toLowerCase() === username.toLowerCase());
        
        if (existing) {
            if (score > existing.score) {
                existing.score = score;
                existing.lastPlayed = new Date().toISOString();
            }
        } else {
            this.rankings.push({
                name: username,
                score: score,
                lastPlayed: new Date().toISOString(),
                consecutiveBonus: consecutiveBonus
            });
        }
        
        // Ordenar por pontuação (maior para menor)
        this.rankings.sort((a, b) => b.score - a.score);
        
        // Manter apenas os 10 melhores
        if (this.rankings.length > 10) {
            this.rankings = this.rankings.slice(0, 10);
        }
        
        this.saveRankings();
    }
};

// Perguntas do Quiz
const QUESTIONS = [
    // Fáceis (3 questões)
    {
        question: "Ao longo de sua trajetoria a terra passa por um fênomeno astrônomo que acontece duas vezes ao ano, em março e setembro, conhecido como equinocio, que é o principal culpado por: ",
        options: [
        "Dias e noites com durações totalmente diferentes em cada hemisfério",
        "Dias e noites com durações completamente iguais",
        "Dias e noites com durações quase iguais",
        "Sucessão dos dias e noites mais rapidos",
        "Duração menor dos dias e noites"
        ],
        correct: 2,
        difficulty: "easy",
        time: 60,
        image: "img/Equinocio.gif"
    },
    {
        question: "Em certos periodos, a terra se encontra em estações diferentes em cada um de seus hemisferios, identifique os hemiferios e o nome do fenômeno: ",
        options: [
            "Inclinação do eixo da Terra, hemisférios Leste e Oeste",
"Inclinação do eixo da terra nos hemisféios Norte e Sul",
"Inlinação do eixo da terra, no tropico de cancer e capricornio",
"Inclinação do eixo da terra nos hemisférios ao sul do Trop de capr e norte do Trop de cancer"
            ],
        correct: 1,
        difficulty: "easy",
        time: 60,
        image: "img/Equador.gif",
    },
    {
        question: "Em certos periodos, a terra passa por um fênomeno que é reponsavel pela má distribuição de iluminação onde um dos hemisferios recebe mais iluminação do que o outro hemisferio, fazendo assim com que as eleições ocorram de maneira inversa em cada um dos hemisferios, este fênomeno é chamado de:  ",
        options: [
"Equinocios",
"Periélio",
"Solsticis",
"Soustício",
"Solsticios",
"Solticios",
            ],
        correct: 4,
        difficulty: "easy",
        time: 90,
        image: "img/Equinocio.gif"
    },
    
    // Médias (3 questões)
    {
        question: "Na terra existem dois tropicos onde um se localiza no hemisfério norte e o outro no hemisferio sul, identifique quais tropicos representam cada letra e sobre quais tropicos estamos falando: ",
        options: [
            "Tropico de câncer e Capricornio. onde A é o de Capricornio e o B o de Cancer",
"Tropico de câncer e Capricornio. onde B é o de câncer e o A o de capricornio",
"Tropico de câncer e Greenwich. onde B é o de Greenwich e o A o de Cancer",
"Tropico de capricornio e o de câncer. onde A é o de Greenwich e o B o de Cancer",
"Tropico de capricornio e o de câncer. onde A é o de Greenwich e o B o de Cancer",
"Tropico de capricornio e o de câncer. onde A é o de Câncer o B o de Capricornio",
            ],
        correct: 5,
        difficulty: "medio",
        time: 90,
        image: "img/Tropicos.png"
    },
    
    {
        question: "A inclinação do eixo da Terra em relação ao plano de sua órbita desempenha um papel essencial na forma como a energia solar se distribui pelo planeta e na organização das zonas climáticas. Explique de que maneira essa inclinação modifica a quantidade de radiação solar recebida em diferentes latitudes e como essa variação contribui para a formação dos padrões climáticos da Terra: ",
        options: [
            "A inclinação do eixo da Terra faz com que a radiação solar atinja o planeta com intensidades diferentes nas latitudes. Regiões próximas ao Equador recebem luz mais direta e são mais quentes, enquanto regiões próximas aos polos recebem menos energia solar e são mais frias. Essa diferença influencia a formação das zonas climáticas e os padrões de clima do planeta.",

"A inclinação do eixo da Terra faz com que um hemisfério receba mais radiação solar em determinados períodos do ano do que o outro, o que altera as temperaturas e influencia os padrões climáticos em diferentes regiões.",

"As diferenças climáticas da Terra acontecem principalmente porque algumas regiões estão mais próximas do Sol do que outras durante a órbita do planeta.",

"A inclinação do eixo da Terra faz com que o Sol fique mais forte no centro da Terra e mais fraco nas bordas do planeta.",
            ],
        correct: 1,
        difficulty: "medio",
        time: 90,
        image: "img/TerraGirando.gif"
    },
    
    // Difíceis (2 questões)
    {
        question: "O movimento de rotação da terra ocorre no sentido anti-horario de oeste para leste em torno de um eixo imaginario que passa pelos dois polos. Esse movimento influencia... : ",
        options: [
            "faz com que diferentes partes do planeta se voltem para o Sol ou fiquem voltadas para o lado oposto. A parte voltada para o Sol recebe luz (dia), enquanto a parte oposta fica sem iluminação (noite).",

"A Terra gira em torno de seu próprio eixo. Quando uma região está voltada para o Sol ocorre o dia, e quando fica voltada para o lado oposto ocorre a noite.",

"O movimento de rotação faz com que a Terra gire continuamente. Assim, as partes do planeta entram e saem da iluminação solar, gerando a alternância entre dia e noite.",

"À medida que a Terra gira, diferentes regiões passam a receber luz solar enquanto outras ficam na sombra, provocando a sucessão de dias e noites no planeta.",

            ],
        correct: [0, 1, 2, 3],
        difficulty: "dificil",
        time: 120,
        image: "img/rotacao.gif"
    },
    {
        question: "Qual o caminho mais curto?",
        options: ["Nilo", "Amazonas", "Danúbio", "Mississipi"],
        correct: 2,
        difficulty: "dificil",
        time: 120,
        image: "img/Caminho.png".width = '100px',
    }
];

// Sistema de Áudio
const AudioSystem = {
    sounds: {},
    
    init() {
        // Sons mais atraentes e menos enjoativos
        this.sounds.correct = new Audio('https://assets.mixkit.co/active_storage/sfx/2030/2030-preview.mp3');
        this.sounds.wrong = new Audio('https://assets.mixkit.co/active_storage/sfx/2031/2031-preview.mp3');
        this.sounds.timeUp = new Audio('https://assets.mixkit.co/active_storage/sfx/2032/2032-preview.mp3');
        this.sounds.buttonClick = new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3');
        this.sounds.levelUp = new Audio('https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3');
        
        // Configurar volumes
        this.sounds.correct.volume = 0.4;
        this.sounds.wrong.volume = 0.4;
        this.sounds.timeUp.volume = 0.4;
        this.sounds.buttonClick.volume = 0.4;
        this.sounds.levelUp.volume = 0.4;
    },
    
    playCorrect() {
        this.sounds.correct.currentTime = 0;
        this.sounds.correct.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playWrong() {
        this.sounds.wrong.currentTime = 0;
        this.sounds.wrong.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playTimeUp() {
        this.sounds.timeUp.currentTime = 0;
        this.sounds.timeUp.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playButton() {
        this.sounds.buttonClick.currentTime = 0;
        this.sounds.buttonClick.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playLevelUp() {
        this.sounds.levelUp.currentTime = 0;
        this.sounds.levelUp.play().catch(e => console.log('Áudio bloqueado'));
    }
};

// Sistema do Jogo
const Game = {
    currentUser: null,
    currentQuestionIndex: 0,
    score: 0,
    consecutiveCorrect: 0,
    timer: null,
    timeLeft: 0,
    
    init() {
        GameData.init();
        AudioSystem.init();
        this.setupEventListeners();
        this.showScreen('login-screen');
    },
    
    setupEventListeners() {
        // Formulários de login/cadastro
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            if (username) {
                this.startGame(username);
            }
        });
        
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            if (username) {
                if (GameData.registerUser(username)) {
                    this.startGame(username);
                } else {
                    alert('Nome de usuário já existe. Escolha outro.');
                }
            }
        });
        
        // Botão próximo
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Botão pular
        document.getElementById('skip-btn').addEventListener('click', () => {
            this.skipQuestion();
        });
    },
    
    startGuest() {
        this.currentUser = { username: 'Convidado', isGuest: true };
        this.startQuiz();
    },
    
    startGame(username) {
        this.currentUser = GameData.loginUser(username);
        this.startQuiz();
    },
    
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.consecutiveCorrect = 0;
        
        // Embaralhar perguntas
        this.shuffledQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);
        
        this.showScreen('quiz-screen');
        this.updateUserInfo();
        this.loadQuestion();
    },
    
    loadQuestion() {
        if (this.currentQuestionIndex >= this.shuffledQuestions.length) {
            this.endGame();
            return;
        }
        
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        
        // Atualizar UI
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('question-image').style.backgroundImage = `url('${question.image}')`;
        document.getElementById('question-counter').textContent = `Questão ${this.currentQuestionIndex + 1} de ${this.shuffledQuestions.length}`;
        document.getElementById('difficulty-badge').textContent = question.difficulty.toUpperCase();
        document.getElementById('difficulty-badge').className = `difficulty ${question.difficulty}`;
        
        // Atualizar progresso
        const progress = ((this.currentQuestionIndex) / this.shuffledQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Criar opções na ordem original
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span> ${option}`;
            button.onclick = () => {
                AudioSystem.playButton();
                this.checkAnswer(index, question.correct);
            };
            optionsContainer.appendChild(button);
        });
        
        // Iniciar timer
        this.startTimer(question.time);
        
        // Mostrar/ocultar feedback
        document.getElementById('feedback-container').classList.add('hidden');
        document.getElementById('question-container').style.display = 'block';
    },
    
    startTimer(seconds) {
        this.timeLeft = seconds;
        this.updateTimerDisplay();
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    },
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timer').textContent = timeStr;
        
        // Mudar cor do timer quando estiver acabando
        if (this.timeLeft <= 10) {
            document.getElementById('timer').style.borderColor = 'var(--error-color)';
            document.getElementById('timer').style.color = 'var(--error-color)';
        } else {
            document.getElementById('timer').style.borderColor = 'var(--border-color)';
            document.getElementById('timer').style.color = 'var(--primary-color)';
        }
    },
    
    checkAnswer(selectedIndex) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Desabilitar botões
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Destacar respostas
        buttons.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        // Atualizar pontuação e feedback
        if (isCorrect) {
            this.score += 3;
            this.consecutiveCorrect++;
            this.showFeedback('success', 'Resposta Correta! +3 pontos');
            AudioSystem.playCorrect();
        } else {
            this.consecutiveCorrect = 0;
            this.showFeedback('error', `Resposta Errada! A alternativa correta era: ${question.options[question.correct]}`);
            AudioSystem.playWrong();
        }
        
        this.updateUserInfo();
        
        // Mostrar feedback e esconder questões
        document.getElementById('feedback-container').classList.remove('hidden');
        document.getElementById('question-container').style.display = 'none';
    },
    
    showFeedback(type, message) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackMessage = document.getElementById('feedback-message');
        
        feedbackMessage.className = `feedback-message ${type}`;
        feedbackMessage.textContent = message;
        feedbackContainer.classList.remove('hidden');
    },
    
    nextQuestion() {
        this.currentQuestionIndex++;
        document.getElementById('question-container').style.display = 'block';
        this.loadQuestion();
    },
    
    skipQuestion() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Resetar sequência de acertos
        this.consecutiveCorrect = 0;
        
        // Mostrar feedback de pulo
        this.showFeedback('error', 'Questão pulada! Nenhum ponto ganho.');
        AudioSystem.playButton();
        
        this.updateUserInfo();
        
        // Avançar para próxima questão
        this.currentQuestionIndex++;
        document.getElementById('question-container').style.display = 'block';
        this.loadQuestion();
    },
    
    timeUp() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        AudioSystem.playTimeUp();
        this.showFeedback('error', 'Tempo esgotado!');
        
        // Destacar resposta correta
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            }
        });
        
        // Desabilitar botões
        buttons.forEach(btn => btn.disabled = true);
        
        this.consecutiveCorrect = 0;
        this.updateUserInfo();
        
        document.getElementById('feedback-container').classList.remove('hidden');
        document.getElementById('question-container').style.display = 'none';
    },
    
    endGame() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Bônus por sequência
        let bonus = 0;
        if (this.consecutiveCorrect >= 7) {
            bonus = 6;
            this.score += bonus;
        }
        
        // Salvar no ranking
        GameData.addScore(this.currentUser.username, this.score, bonus);
        
        // Mostrar ranking
        this.showRanking();
    },
    
    showRanking() {
        this.showScreen('ranking-screen');
        // Forçar recarregamento dos rankings do localStorage para garantir dados atualizados
        const savedRankings = localStorage.getItem('geo_vibes_rankings');
        if (savedRankings) {
            GameData.rankings = JSON.parse(savedRankings);
        }
        this.updateRankingList();
    },
    
    updateRankingList() {
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        
        GameData.rankings.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            
            const rank = document.createElement('div');
            rank.className = 'rank';
            rank.textContent = `${index + 1}º`;
            
            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = entry.name;
            
            const score = document.createElement('div');
            score.className = 'score';
            score.textContent = `${entry.score} pts`;
            
            item.appendChild(rank);
            item.appendChild(name);
            item.appendChild(score);
            rankingList.appendChild(item);
        });
    },
    
    updateUserInfo() {
        document.getElementById('current-user').textContent = this.currentUser.username;
        document.getElementById('current-score').textContent = `Pontos: ${this.score}`;
    },
    
    showScreen(screenId) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar tela desejada
        document.getElementById(screenId).classList.add('active');
    },
    
    // Função para embaralhar as opções de resposta
    shuffleOptions(options, correctIndex) {
        // Criar cópia do array de opções
        const optionsCopy = [...options];
        const indices = Array.from({length: options.length}, (_, i) => i);
        
        // Embaralhar os índices
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Criar novo array de opções embaralhadas
        const shuffledOptions = indices.map(index => optionsCopy[index]);
        
        // Encontrar o novo índice da resposta correta
        const newCorrectIndex = indices.indexOf(correctIndex);
        
        return {
            options: shuffledOptions,
            correctIndex: newCorrectIndex
        };
    }
};

// Funções auxiliares
function switchTab(tab) {
    // Atualizar abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar formulários
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById(tab + '-form').classList.add('active');
}

function restartGame() {
    Game.startQuiz();
}

function goToLogin() {
    Game.showScreen('login-screen');
}

// Iniciar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});