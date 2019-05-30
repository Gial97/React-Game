import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './components/card/Card'
import GuessCount from './components/guesscount/GuessCount'
const SIDE = 10
const SYMBOLS = '🍕🍔🍟🍿🌭🥓🥚🍳🥞🍞🥐🥨🧀🥖🥗🥫🌯🌮🍖🍗🥩🥠🥟🍠🥡🍱🍘🍛🍣🍥🍤🍢🥘🥣🍝🍲🥧🍦🍧🍪🍩🍨🎂🍰🍭🍬🍫🍡🍮🍯🥛🍼☕🍵🍷🍾🍶🍸🍹🍺🥃🥂🍻🥤🥢🥄🍴🏺🥝🥥🍉🍈🍇🍊🍋🍌🍎🍍🍏🍐🍑🍅🍓🍒🍆🌽🥒🥑🍄🥦🥔🥕🌰🥜💐🌹🌸🌺🌻🌼🥀🌷🌱🌲🌳🌾🌵🌴🌿🍀🍁🍃🍂🎈🎆🎇🎉✨🎊🎃🎄🎎🎍🎋🎏🎐🎑🎁🎀🎡🎠🎫🎢🛒👓🧥👔👖👕🧣🧤🧦👘👗👚👜👛👙👝🎒👟👞👠👡👑👢👒🧢🎩🎓💋💎💍💄⚽⚾🏈🏐🏀🏉🎱🎳⛳🥌🎣🎽🛷🎿🛶🥅🏒🏓🏑🏏🏸🎾🥊🎯🥋🥇🥈🏅🥉🏆🎮🔮🎲🎰🃏🎴🀄🎼🎵🎶🎤🎧📯🎺🎷🥁🎸🎻📻🎹🔒🔑💉💊🔭🔬🔗📿🏹🔪🔫💣📞📟📠📱🚬🔋🗿🔌💻💽💾📀🎥🎬📷📺📡🔎🔦💡📕📓💰🔖💵📬📌📍📎📐📏👩👧👶🧓👩‍👨‍👱‍🤴👲🤶👮‍💂‍👩‍🎓👨‍🏫👩‍🌾👨‍🍳👩‍🏭👨‍💼👩‍👨‍🎤👩‍✈️👨‍🚀🤱🧙‍🧚‍🧜‍🚐🚒🚜🚖🛴🚈🚃🚉🚟🚂💺🛸🚤🚏🚥🏁🌌🌎🏠🕋🕍🏣🏭💒🗽⛲🌃🌆💈🚿🌝🌓🌙🌜⭐🌀⚡⛄🌈🌊'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state = {
    cards: this.generateCards(),
    currentPair: [],
    guesses: 0,
    matchedCardIndices: []
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
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  render() {
    const { cards, guesses} = this.state
    return (
      <div className="memory">
        <div className='score'><GuessCount guesses={guesses} /></div>
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