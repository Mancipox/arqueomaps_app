/* 
Author: Sebastian Mancipe
Date: 
Last update: July 12 - 2019
Description: 
This component contains the bottom section of buttons that reset, shows or allow the creation of 
polylines based in the user input.
*/

import React, {Component} from 'react'
import {ButtonGroup, Button, Dropdown, DropdownButton} from 'react-bootstrap'
import '../styles/map.css'

class BottomButtonsMap extends Component{
  constructor(props){
    super(props);
    this.state = {
      showManually: false,
      showMany2One: false
    }
  }

  showPolylineStack = (e) =>{
    this.props.BottomButtonsMapProps.generatePolylineStack()
  }

  showPolylineManually = (e,isReset) =>{
    this.props.BottomButtonsMapProps.generatePolylineManually(isReset)
    this.setState({showManually:(this.state.showManually)?false:true})
  }

  showPolylineMany2One  = (e,isReset) =>{
    this.props.BottomButtonsMapProps.generatePolylineMany2One(isReset)
    this.setState({showMany2One:(this.state.showMany2One)?false:true})
  }

  render() {
    return(
      <ButtonGroup size="sm" aria-label="Basic example" className="buttonGroupHorizontal">
          <Button variant="secondary" onClick={this.showPolylineStack}>Stack</Button>
          <DropdownButton id="dropdown-basic-button" title="Manually">
                <Dropdown.Item onClick={(e) => this.showPolylineManually(e,false)}>{(this.state.showManually)?'Deactivate':'Activate'}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => this.showPolylineManually(e,true)}>Reset</Dropdown.Item>
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" title="Many2One">
                <Dropdown.Item onClick={(e) => this.showPolylineMany2One(e,false)}>{(this.state.showMany2One)?'Deactivate':'Activate'}</Dropdown.Item>
                <Dropdown.Item onClick={(e) => this.showPolylineMany2One(e,true)}>Reset</Dropdown.Item>
          </DropdownButton>
      </ButtonGroup>
    )
  }
}

export default BottomButtonsMap
