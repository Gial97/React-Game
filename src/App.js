import React, { Component } from 'react';
import './components/Card.css';
import './components/Game.css';
import View from './components/View';
import Cards from './components/Cards';


class App extends Component {
  constructor(props) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
    this.playAgain = this.playAgain.bind(this);
    this.Cards = new Cards();
  }

  componentWillMount() {
    this.start()
  }

  start() {
    this.Cards.generateCards();
    this.setState({
      turnNo : 1,
      pairsFound : 0,
      numClicksWithinTurn : 0,
      firstId : undefined,
      secondId : undefined
    });
  }

  cardViews() {
    let cardViews = [];
    let onClick = this.cardClicked;
    this.Cards.cards.forEach(c => {
      let cardView = <View key={c.id} 
        id={c.id} 
        image={c.image}
        imageUp = {c.imageUp}
        matched = {c.matched} 
        onClick={onClick}/>;
        cardViews.push(cardView);
    });
    return cardViews;
  }

  clearCards(id1,id2) {
    if (this.state.numClicksWithinTurn !== 2) {
      return;
    }
    this.Cards.flipCard(this.state.firstId, false);
    this.Cards.flipCard(this.state.secondId, false);
    this.setState({
      firstId: undefined,
      secondId: undefined,
      numClicksWithinTurn: 0,
      turnNo : this.state.turnNo+1
    });
  }

  cardClicked(id,image) {
    if (this.state.numClicksWithinTurn === 0 || this.state.numClicksWithinTurn === 2) {
      if (this.state.numClicksWithinTurn === 2) {
        clearTimeout(this.timeout);
        this.clearCards(this.state.firstId, this.state.secondId);        
      }
      this.Cards.flipCard(id, true);
      this.setState({
        firstId : id,
        numClicksWithinTurn : 1
      });
    } else if (this.state.numClicksWithinTurn === 1) {
      this.Cards.flipCard(id, true);
      this.setState({
        secondId : id,
        numClicksWithinTurn : 2
      });

      if (this.Cards.cardsIdenticalImages(id, this.state.firstId)) {
        this.Cards.setCardMatched(this.state.firstId, true);
        this.Cards.setCardMatched(id, true);
        this.setState({
          pairsFound: this.state.pairsFound+1,
          firstId: undefined,
          secondId: undefined,
          turnNo : this.state.turnNo+1,
          numClicksWithinTurn: 0
        });

      } else {
        this.timeout = setTimeout(() => { 
          this.clearCards(this.state.firstId, this.state.secondId);
        },1250); 
      }

    }
  }

  playAgain() {
    this.start();
  }

  render() {
    let cardViews = this.cardViews();
    let gameStatus = <div className='Status'>
      <div>Tura: {this.state.turnNo}</div>
      <div>Znalezione pary: {this.state.pairsFound}</div>
    </div>;

    if (this.state.pairsFound === this.Cards.NUM_IMAGES) {
      gameStatus = <div className='Status'>
        <div>GRA UKOŃCZONA!</div>
        <div>Użyłeś {this.state.turnNo-1} tór(y)</div>
        <div><button onClick={this.playAgain}>Zagraj ponownie!</button></div>
      </div>;      
    }

    return (
      <div className='Game'>
        <header className='Header'>
          <div className='Title'>Gra Memory</div>
        </header>
        <div>
          {gameStatus}
        </div>
        <div className='CardContainer'>
          {cardViews}
        </div>
      </div>
    );
  }
}

export default App;