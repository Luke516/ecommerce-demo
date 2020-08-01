import React from 'react';
import './App.css';
import {withCookies} from 'react-cookie';
import TrackVisibility from 'react-on-screen';
import queryString from 'query-string';

import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Carousel, Button, Card, CardDeck, InputGroup, Form, FormControl } from 'react-bootstrap';
import ProductCell from './ProductCell'
import {shuffle} from './utils/utlis'
import {translate} from './utils/translate'

class ProductRow extends React.Component {

    getInitState() {
        const {cookies} = this.props
        let reachEnd = false
        let count = 12 > this.props.data.length ? this.props.data.length : 12 

        let params = queryString.parse(this.props.location.search)
        if(params.c){
            count = parseInt(params.c)
            count = Math.min(count, this.props.data.length)
        }

        return {
            count,
            reachEnd,
            username: cookies.get('username')? cookies.get('username') : ""
        }
    }
  
    constructor(props) {
      super(props);
      this.getInitState = this.getInitState.bind(this);
      this.loadMore = this.loadMore.bind(this)
      
      this.state = this.getInitState()

      const {cookies} = this.props
      let browsed = cookies.get('browsed')? cookies.get('browsed') : [];
      if(browsed.length < 4){
        browsed = []
        let browsing = this.props.data.slice(0, this.state.count)
        for(let b of browsing){
            if(b.id != this.props.targetProductId && b.id != this.props.controlProductId){
                browsed.push(b)
            }
        }
        cookies.set('browsed', browsed)
        console.log(browsed)
      }
    }
  
    render (){
      let count = this.state.count
      if(this.props.name.includes("all") && this.props.orderMethod == "recommand"){
        count = Math.min(count+2, this.props.data.length)
      }
      return (
        <>
        <Row className="mt-2 Dd-flex flex-row align-items-end">
            {
                (this.props.name.includes("all") && this.props.orderMethod == "recommand") ?
                this.props.data.slice(2, count).map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} target={this.props.target} isVisible={this.props.isVisible } username={this.state.username} />
                }):
                this.props.data.slice(0, count).map(element => {
                    return <ProductCell key={element.id} product={element} addProductToCart={this.props.addProductToCart} showProduct={this.props.showProduct} target={this.props.target} isVisible={this.props.isVisible } username={this.state.username} />
                })
            }
        </Row>
        {
            !this.state.reachEnd &&
            <Row className="my-4 d-flex justify-content-center">
                <Button size="lg" onClick={this.loadMore} className="w-25 text-center" variant="light2">
                    {translate("Load More")}
                </Button>
            </Row>
        }
        </>
      );
    }

    loadMore(e) {
        let count = Math.min(this.state.count + 12, this.props.data.length)
        let reachEnd = (count === this.props.data.length ? true: false) 
        
        this.setState({
            count,
            reachEnd
        }, () => {
            this.props.history.push({
                search: '?c=' + this.state.count
            })
        })
    }
}

export default withRouter(withCookies(ProductRow))