import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './components/card/Card'
import Scores from './components/score/Scores'
const SIDE = 10
const SYMBOLS = '👹👺👽👻☠👾🤖💩😺🐱‍👤🐱‍🚀🦁🐯🐺🐶🐭🐹🐰🐗🐷🐮🐻🐨🐼🐸🎁🎊🎃🎒👕🧥👖🧤🎱🏉🏀🏐⚾⚽🔮🎳💎🎓🎯🏆🎮🔈🔔🃏🔮🔒🎹📱💻🔋🏹📀📷🎥💼🍟🥞🥗🍪🍧🍎🍄🥥🏺🥃🌸💐🍁'
const VISUAL_PAUSE_MSECS = 550

class App extends Component {
  state = {
    cards: this.generateCards(),
    currentPair: [],
    scores: 0,
    matchedCardIndices: []
  }

  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }
  
  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, scores, matchedCardIndices } = this.state
    const newPair = [currentPair[0], index]
    const newScores = scores + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, scores: newScores })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  generateCards() {
    const result = []
    const size = SIDE * 2
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }


  render() {
    const { cards, scores} = this.state
    return (
      <div className="memory">
        <div className='score'><Scores scores={scores} /></div>
        < div className='cards'>
          {cards.map((card, index) => (
            <Card
              card={card}
              feedback={this.getFeedbackForCard(index)}
              key={index}
              index={index}
              onClick={this.handleCardClick}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default App