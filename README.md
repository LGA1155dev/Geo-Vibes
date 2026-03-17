# Geo-Vibes - Quiz de Geografia

Um jogo de quiz interativo sobre geografia com login, ranking e temporizador!

## 🎮 Funcionalidades

### Sistema de Login e Cadastro
- **Login**: Usuários podem fazer login com nome de usuário
- **Cadastro**: Novos usuários podem se cadastrar
- **Convidado**: Opção para jogar sem cadastro
- **Armazenamento**: Dados salvos localmente no navegador

### Quiz de Geografia
- **8 Perguntas**: Distribuídas em 3 níveis de dificuldade
  - 3 questões fáceis (1 minuto cada)
  - 3 questões médias (1 minuto cada) 
  - 2 questões difíceis (2 minutos cada)
- **Imagens**: Cada pergunta possui uma imagem ilustrativa
- **Temporizador**: Contagem regressiva com alerta visual quando está acabando

### Sistema de Pontuação
- **Pontos por resposta**: 3 pontos por resposta correta
- **Bônus de sequência**: 6 pontos extras por 7 respostas corretas consecutivas
- **Feedback sonoro**: Áudios para respostas corretas e erradas
- **Feedback visual**: 
  - ✅ Verde para respostas corretas
  - ❌ Vermelho para respostas erradas

### Ranking
- **Top 10**: Mostra os melhores jogadores
- **Persistência**: Dados salvos no localStorage
- **Atualização**: Ranking atualizado após cada partida

## 🚀 Como Jogar

1. **Iniciar o Jogo**:
   ```bash
   python3 -m http.server 8000
   ```
   Acesse: http://localhost:8000

2. **Escolha uma opção**:
   - Faça login com seu nome de usuário
   - Cadastre-se como novo jogador
   - Jogue como convidado

3. **Responda às perguntas**:
   - Cada pergunta tem tempo limitado
   - Selecione a alternativa correta
   - Receba feedback imediato

4. **Veja o ranking**:
   - Após terminar o quiz, veja sua posição
   - Compare sua pontuação com outros jogadores

## 🏗️ Estrutura do Projeto

```
Geo-Vibes/
├── index.html      # Estrutura HTML principal
├── styles.css      # Estilização CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este arquivo
```

## 🎨 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização com Grid, Flexbox e variáveis CSS
- **JavaScript ES6+**: Lógica do jogo, manipulação do DOM
- **LocalStorage**: Armazenamento de dados do usuário e ranking
- **API de Áudio**: Feedback sonoro para interações

## 📱 Design Responsivo

O jogo foi projetado para funcionar em diferentes dispositivos:
- **Desktop**: Layout em grade para opções de resposta
- **Mobile**: Layout adaptado para telas menores
- **Interface intuitiva**: Fácil de usar em qualquer dispositivo

## 🔧 Personalização

### Adicionar Perguntas
No arquivo `script.js`, na constante `QUESTIONS`, você pode adicionar novas perguntas:

```javascript
{
    question: "Sua pergunta aqui?",
    options: ["Opção A", "Opção B", "Opção C", "Opção D"],
    correct: 2, // Índice da resposta correta (0-3)
    difficulty: "easy|medium|hard",
    time: 60, // Tempo em segundos
    image: "URL da imagem ilustrativa"
}
```

### Alterar Tempos
- Questões fáceis e médias: 60 segundos
- Questões difíceis: 120 segundos

### Personalizar Estilos
Use as variáveis CSS no início do arquivo `styles.css` para alterar cores e estilos.

## 🎯 Próximos Passos

Ideias para melhorias futuras:
- [ ] Sistema de categorias de perguntas
- [ ] Modo de prática sem tempo
- [ ] Estatísticas de desempenho
- [ ] Perguntas aleatórias (sem repetição)
- [ ] Sistema de conquistas

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

---

**Divirta-se testando seus conhecimentos geográficos!** 🌍