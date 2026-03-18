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
            // Ranking inicial vazio - só mostrar jogadores reais
            this.rankings = [];
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
        difficulty: "medium",
        time: 90,
        image: "img/Tropicos.png"
    },
    
    {
        question: "Inclinação da Terra: como afeta a radiação solar e o clima?",
        options: [
            "Equador recebe mais energia; polos menos → climas diferentes..",

            "Um hemisfério recebe mais sol em certas épocas do ano.",

            "Clima varia por estar mais perto do Sol na órbita.",

            "Sol é mais forte no centro da Terra que nas bordas.",
            ],
        correct: 0,
        difficulty: "medium",
        time: 90,
        image: "img/TerraGirando.gif"
    },
    
    // Difíceis (2 questões)
    {
        question: "Considerando o movimento de rotação da Terra (de oeste para leste), qual explicação descreve corretamente o mecanismo físico responsável pela sucessão de dias e noites, levando em conta a posição relativa entre Terra e Sol?",
        options: [
            "A rotação terrestre altera continuamente a orientação das diferentes longitudes em relação à radiação solar, fazendo com que regiões entrem e saiam do campo de iluminação.",

"A sucessão de dias e noites ocorre porque a órbita elíptica da Terra modifica periodicamente a distância entre o planeta e o Sol ao longo de um mesmo dia.",

"A rotação provoca variações na intensidade intrínseca da radiação solar, que se intensifica quando incide diretamente e diminui quando se dispersa.",

"O movimento de rotação desloca o eixo terrestre em relação ao plano orbital a cada dia, alterando a incidência solar entre hemisférios.",

            ],
        correct: 0,
        difficulty: "hard",
        time: 240,
        image: "img/rotacao-da-terra.gif"
    },
    {
        question: "Qual o caminho mais curto?",
        options: [
            "Leste, Oeste, Oeste",
             "Leste, Oeste, Sul",
              "Leste, Norte, Oeste", 
              "Nordeste, Centro-Oeste, Noroeste"
            ],
        correct: 0,
        difficulty: "hard",
        time: 120,
        image: "img/Caminho.png",
    },
    
    // Impossíveis (3 questões)
    {
        question: "Em um experimento de física, um satélite geoestacionário é lançado da Terra. Considerando a inclinação do eixo terrestre de 23,5° e a rotação da Terra, qual é a relação matemática que descreve a variação da força gravitacional sentida pelo satélite ao longo de um ciclo completo de 24 horas, considerando a variação da distância do centro da Terra devido à forma oblata do planeta?",
        options: [
            "F = G * (M*m) / r² * (1 + 0,00335 * cos(2θ)) onde θ é a latitude",
            "F = G * (M*m) / r² * (1 + 0,00335 * sin(ωt)) onde ω é a velocidade angular",
            "F = G * (M*m) / r² * (1 + 0,00335 * cos(ωt)) onde ω = 2π/24h",
            "F = G * (M*m) / r² * (1 + 0,00335 * sin²(θ)) onde θ é a inclinação do eixo",
            "F = G * (M*m) / r² * (1 + 0,00335 * cos²(ωt)) onde ω = π/12h"
        ],
        correct: 2,
        difficulty: "impossible",
        time: 180,
        image: "img/Inclinacao.gif"
    },
    {
        question: "Um observador no Hemisfério Sul quer calcular o ângulo de elevação do Sol ao meio-dia durante o Solstício de Verão. Sabendo que a latitude do observador é 30°S e considerando a inclinação do eixo terrestre de 23,5°, qual é a fórmula correta para calcular a altura solar máxima (h) em graus?",
        options: [
            "h = 90° - latitude + 23,5°",
            "h = 90° - latitude - 23,5°",
            "h = 90° + latitude - 23,5°",
            "h = 90° + latitude + 23,5°",
            "h = 90° - |latitude - 23,5°|"
        ],
        correct: 0,
        difficulty: "impossible",
        time: 180,
        image: "img/Solsticio.gif"
    },
    {
        question: "Durante um eclipse lunar total, a sombra da Terra tem um diâmetro angular de aproximadamente 1,4° no céu. Se considerarmos que a Lua está a 384.400 km da Terra e tem um diâmetro de 3.474 km, qual é a distância aproximada entre o centro da Terra e o ponto onde a sombra da Terra termina (cone de umbra), considerando a geometria do eclipse e a inclinação orbital da Lua de 5,14°?",
        options: [
            "1.384.400 km",
            "1.400.000 km",
            "1.416.000 km",
            "1.450.000 km",
            "1.500.000 km"
        ],
        correct: 2,
        difficulty: "impossible",
        time: 180,
        image: "img/InlinacaoTerra.gif"
    }
];

        // Sistema de Áudio
const AudioSystem = {
    sounds: {},
    backgroundMusic: null,
    isMusicPlaying: false,
    
    init() {
        // Sons mais atraentes e menos enjoativos
        this.sounds.correct = new Audio('https://assets.mixkit.co/active_storage/sfx/2030/2030-preview.mp3');
        this.sounds.wrong = new Audio('https://assets.mixkit.co/active_storage/sfx/2031/2031-preview.mp3');
        this.sounds.timeUp = new Audio('https://assets.mixkit.co/active_storage/sfx/2032/2032-preview.mp3');
        this.sounds.buttonClick = new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3');
        this.sounds.levelUp = new Audio('https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3');
        this.sounds.perfectStreak = new Audio('https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3');
        this.sounds.impossibleBonus = new Audio('https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3');
        
        // Música de fundo emocionante
        this.backgroundMusic = new Audio('songs/background.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        
        // Configurar volumes
        this.sounds.correct.volume = 0.4;
        this.sounds.wrong.volume = 0.4;
        this.sounds.timeUp.volume = 0.4;
        this.sounds.buttonClick.volume = 0.4;
        this.sounds.levelUp.volume = 0.4;
        this.sounds.perfectStreak.volume = 0.6;
        this.sounds.impossibleBonus.volume = 0.5;
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
    },
    
    playPerfectStreak() {
        this.sounds.perfectStreak.currentTime = 0;
        this.sounds.perfectStreak.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playImpossibleBonus() {
        this.sounds.impossibleBonus.currentTime = 0;
        this.sounds.impossibleBonus.play().catch(e => console.log('Áudio bloqueado'));
    },
    
    playBackgroundMusic() {
        if (!this.isMusicPlaying) {
            this.backgroundMusic.play().catch(e => console.log('Música de fundo bloqueada'));
            this.isMusicPlaying = true;
        }
    },
    
    pauseBackgroundMusic() {
        if (this.isMusicPlaying) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
        }
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
        this.impossibleStreak = 0; // Contador de acertos impossíveis consecutivos
        
        // Embaralhar perguntas
        this.shuffledQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);
        
        this.showScreen('quiz-screen');
        this.updateUserInfo();
        this.loadQuestion();
        
        // Iniciar música de fundo
        AudioSystem.playBackgroundMusic();
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
        
        // Efeitos visuais mais emocionantes para o timer
        const timerElement = document.getElementById('timer');
        
        // Timer piscando quando estiver acabando
        if (this.timeLeft <= 5) {
            timerElement.style.borderColor = 'var(--error-color)';
            timerElement.style.color = 'var(--error-color)';
            timerElement.style.animation = 'pulse 0.5s infinite';
            timerElement.style.boxShadow = '0 0 10px var(--error-color)';
            
            // Efeito de som de tique-taque acelerado
            if (this.timeLeft % 2 === 0) {
                timerElement.style.transform = 'scale(1.1)';
            } else {
                timerElement.style.transform = 'scale(1)';
            }
        } else if (this.timeLeft <= 10) {
            timerElement.style.borderColor = 'var(--warning-color)';
            timerElement.style.color = 'var(--warning-color)';
            timerElement.style.animation = 'shake 0.5s infinite';
            timerElement.style.boxShadow = '0 0 5px var(--warning-color)';
        } else {
            timerElement.style.borderColor = 'var(--border-color)';
            timerElement.style.color = 'var(--primary-color)';
            timerElement.style.animation = 'none';
            timerElement.style.boxShadow = 'none';
            timerElement.style.transform = 'scale(1)';
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
            // Sistema de pontos dobrados a cada 3 acertos consecutivos
            let points = 3;
            if (this.consecutiveCorrect > 0 && (this.consecutiveCorrect + 1) % 3 === 0) {
                points = 6; // Dobrar pontos a cada 3 acertos
                this.showFeedback('success', `Resposta Correta! +6 pontos (BÔNUS!)`);
                AudioSystem.playLevelUp();
            } else {
                this.showFeedback('success', 'Resposta Correta! +3 pontos');
            }
            
            // Sistema de pontos para questões impossíveis
            if (question.difficulty === 'impossible') {
                points = 6; // 6 pontos para questões impossíveis
                this.impossibleStreak++;
                
                // Bônus de pontos dobrados duas vezes para 3 acertos impossíveis consecutivos
                if (this.impossibleStreak === 3) {
                    const bonusPoints = this.score * 3; // Quadruplicar pontos atuais (dobrar duas vezes)
                    this.score += bonusPoints;
                    this.showFeedback('success', `🎉 TRÊS IMPOSSÍVEIS CONSECUTIVOS! PONTOS ATUAIS QUADRUPLICADOS! +${bonusPoints} pontos!`);
                    AudioSystem.playImpossibleBonus();
                }
            } else {
                this.impossibleStreak = 0; // Resetar streak impossível
            }
            
            this.score += points;
            this.consecutiveCorrect++;
            
            // Áudio especial para sequência perfeita
            if (this.consecutiveCorrect === this.shuffledQuestions.length) {
                AudioSystem.playPerfectStreak();
                this.showFeedback('success', '🎉 SEQUÊNCIA PERFEITA! Parabéns!');
            } else {
                AudioSystem.playCorrect();
            }
        } else {
            this.consecutiveCorrect = 0;
            this.impossibleStreak = 0; // Resetar streak impossível
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
        
        // Efeitos visuais para feedback
        if (type === 'success') {
            feedbackContainer.style.animation = 'popIn 0.3s ease-out';
            feedbackMessage.style.animation = 'bounce 0.5s ease-out';
        } else {
            feedbackContainer.style.animation = 'shake 0.5s ease-out';
        }
        
        // Resetar animação após 1 segundo
        setTimeout(() => {
            feedbackContainer.style.animation = 'none';
            feedbackMessage.style.animation = 'none';
        }, 1000);
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