import React from 'react'
import {Dropdown} from 'shared/components/Dropdown'
import DropdownMenu from 'shared/components/DropdownMenu'
import DropdownInput from 'shared/components/DropdownInput'

import {mount} from 'enzyme'

// mock props
const itemOne = {text: 'foo'}
const itemTwo = {text: 'bar'}
const items = [itemOne, itemTwo]

// automate shallow render and providing new props
const setup = (override = {}) => {
  const props = {
    items: [],
    selected: '',
    onChoose: jest.fn(),
    ...override,
  }

  const defaultState = {
    isOpen: false,
    searchTerm: '',
    filteredItems: items,
    highlightedItemIndex: null,
  }

  const dropdown = mount(<Dropdown {...props} />)

  return {
    props,
    dropdown,
    defaultState,
  }
}

describe('Components.Shared.Dropdown', () => {
  describe('rendering', () => {
    describe('initial render', () => {
      it('renders the dropdown menu button', () => {
        const {dropdown} = setup()

        expect(dropdown.exists()).toBe(true)
      })

      it('does not show the list', () => {
        const {dropdown} = setup({items})

        const menu = dropdown.find(DropdownMenu)
        expect(menu.exists()).toBe(false)
      })
    })

    describe('user interactions', () => {
      describe('opening the <DropdownMenu/>', () => {
        it('shows the menu when clicked', () => {
          const {dropdown} = setup({items})

          dropdown.simulate('click')

          const menu = dropdown.find(DropdownMenu)
          expect(dropdown.state().isOpen).toBe(true)
          expect(menu.exists()).toBe(true)
        })

        it('hides the menu when clicked twice', () => {
          const {dropdown} = setup({items})

          // first click
          dropdown.simulate('click')
          // second click
          dropdown.simulate('click')

          const menu = dropdown.find(DropdownMenu)
          expect(dropdown.state().isOpen).toBe(false)
          expect(menu.exists()).toBe(false)
        })
      })

      describe('the <DropdownInput/>', () => {
        it('does not display the input by default', () => {
          const {dropdown} = setup()
          const input = dropdown.find(DropdownInput)

          expect(input.exists()).toBe(false)
        })

        it('displays the input when provided useAutoCompelete is true', () => {
          const {dropdown} = setup({items, useAutoComplete: true})
          const input = dropdown.find(DropdownInput)

          expect(input.exists()).toBe(false)
        })
      })
    })
  })

  describe('instance methods', () => {
    describe('applyFilter', () => {
      it('filters the list by the searchTerm', () => {
        const {dropdown} = setup({items, useAutoComplete: true})

        dropdown.instance().applyFilter('fo')
        expect(dropdown.state().filteredItems).toEqual([{text: 'foo'}])
      })
    })

    describe('handleFilterChange', () => {
      it('resets filteredList and searchTerm if the filter is empty', () => {
        const {dropdown} = setup({items, useAutoComplete: true})
        const event = {target: {value: ''}}
        dropdown.instance().applyFilter('fo')

        // assert that the list is filtered
        expect(dropdown.state().filteredItems).toEqual([{text: 'foo'}])

        dropdown.instance().handleFilterChange(event)
        const {filteredItems, searchTerm} = dropdown.state()

        expect(filteredItems).toEqual(items)
        expect(searchTerm).toEqual('')
      })
    })

    describe('handleClickOutside', () => {
      it('sets isOpen to false', () => {
        const {dropdown} = setup()
        dropdown.simulate('click')
        dropdown.instance().handleClickOutside()

        expect(dropdown.state().isOpen).toBe(false)
      })
    })

    describe('handleClick', () => {
      it('fires the onClick prop', () => {
        const onClick = jest.fn()
        const {dropdown} = setup({onClick})
        dropdown.instance().handleClick()

        expect(onClick).toHaveBeenCalled()
      })

      it('toggles the isOpen', () => {
        const {dropdown} = setup()

        dropdown.instance().handleClick()
        expect(dropdown.state().isOpen).toBe(true)

        dropdown.instance().handleClick()
        expect(dropdown.state().isOpen).toBe(false)
      })

      it('does nothing if disabled', () => {
        const onClick = jest.fn()
        const {dropdown} = setup({disabled: true, onClick})

        dropdown.instance().handleClick()

        expect(dropdown.state().isOpen).toBe(false)
        expect(onClick).not.toHaveBeenCalled()
      })
    })

    describe('handleSelection', () => {
      it('it calls onChoose with the item provided', () => {
        const onChoose = jest.fn(item => item)
        const {dropdown} = setup({onChoose})

        dropdown.simulate('click')
        dropdown.instance().handleSelection(itemOne)()
        expect(onChoose).toHaveBeenCalledTimes(1)
        expect(onChoose.mock.calls[0][0]).toEqual(itemOne)
      })

      it('closes the menu', () => {
        const {dropdown} = setup()
        dropdown.simulate('click')
        expect(dropdown.state().isOpen).toBe(true)

        dropdown.instance().handleSelection(itemOne)()
        expect(dropdown.state().isOpen).toBe(false)
      })

      it('resets state to defaults when opening', () => {
        const {
          dropdown,
          defaultState: {searchTerm, filteredItems, highlightedItemIndex},
        } = setup({items})

        dropdown.setState({
          searchTerm: 'foo',
          filteredItems: [itemOne],
          highlightedItemIndex: 100,
        })

        dropdown.instance().handleSelection(itemOne)()
        expect(dropdown.state().isOpen).toBe(true)
        expect(dropdown.state().searchTerm).toBe(searchTerm)
        expect(dropdown.state().filteredItems).toEqual(filteredItems)
        expect(dropdown.state().highlightedItemIndex).toBe(highlightedItemIndex)
      })
    })
  })
})
