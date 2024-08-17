class DeckOfCards {
    constructor() {
        this.deckId = '';
        this.baseUrl = 'https://www.deckofcardsapi.com/api/deck';
    }

    async initializeDeck() {
        try {
            const response = await fetch(`${this.baseUrl}/new/shuffle/?deck_count=1`);
            const data = await response.json();
            this.deckId = data.deck_id;
            console.log('Deck initialized:', data);
        } catch (error) {
            console.error('Error initializing deck:', error);
            throw error;
        }
    }

    async drawTwo() {
        if (!this.deckId) {
            throw new Error('Deck not initialized');
        }

        try {
            const response = await fetch(`${this.baseUrl}/${this.deckId}/draw/?count=2`);
            const data = await response.json();
            console.log('Cards drawn:', data);
            return data.cards;
        } catch (error) {
            console.error('Error drawing cards:', error);
            throw error;
        }
    }
}

class Game {
    constructor() {
        this.deck = new DeckOfCards();
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.tieGames = 0;
    }

    async setup() {
        await this.deck.initializeDeck();
        const drawButton = document.querySelector("button");
        drawButton.addEventListener("click", () => this.handleDraw());
        drawButton.disabled = false;
        this.updateScoreboard();
    }

    async handleDraw() {
        const drawButton = document.querySelector("button");
        drawButton.disabled = true;
        try {
            const cards = await this.deck.drawTwo();
            document.querySelector("#player1").src = cards[0].image;
            document.querySelector("#player2").src = cards[1].image;
            this.determineWinner(cards[0], cards[1]);
        } catch (error) {
            console.error('Failed to draw cards:', error);
        } finally {
            drawButton.disabled = false;
        }
    }

    determineWinner(card1, card2) {
        const values = {'JACK': 11, 'QUEEN': 12, 'KING': 13, 'ACE': 14};
        const value1 = values[card1.value] || parseInt(card1.value);
        const value2 = values[card2.value] || parseInt(card2.value);

        if (value1 > value2) {
            this.player1Wins++;
            this.displayResult("Player 1 wins!");
        } else if (value2 > value1) {
            this.player2Wins++;
            this.displayResult("Player 2 wins!");
        } else {
            this.tieGames++;
            this.displayResult("It's a tie!");
        }

        this.updateScoreboard();
    }

    displayResult(message) {
        const resultElement = document.querySelector("#result");
        if (resultElement) {
            resultElement.textContent = message;
        }
    }

    updateScoreboard() {
        const scoreboardElement = document.querySelector("#scoreboard");
        if (scoreboardElement) {
            scoreboardElement.textContent = `Player 1: ${this.player1Wins} | Player 2: ${this.player2Wins} | Ties: ${this.tieGames}`;
        }
    }
}

const game = new Game();

// Start the game setup when the page loads
window.addEventListener('load', () => game.setup());
