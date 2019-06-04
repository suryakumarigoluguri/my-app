import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import axios from 'axios';


const { Component } = React;
const { render } = ReactDOM;
var val="all";

const LOAD_STATE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
};

class App extends Component {
  myfun = () => {
  console.log("buttonclicked")
  if (document.getElementById("myText").value){
      val=document.getElementById("myText").value;}
  else{
    val="all";
  }
  this.fetchPhotos(1);
  console.log(val);
  }
  constructor() {
    super();
    this.state = {
      photos: [],
      totalPhotos: 0,
      perPage: 7,
      currentPage: 1,
      loadState: LOAD_STATE.LOADING
    }
  }
  
  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }
  
  fetchPhotos(page) {
    var self = this;
    const { perPage } = this.state;
    const { appId, baseUrl } = this.props;
    const options = {
      params: {
        client_id: appId,
        page: page,
        per_page: perPage,
        query: val
      }
    };
    
    this.setState({ loadState: LOAD_STATE.LOADING });
    axios.get(baseUrl, options)
      .then((response) => {
        self.setState({
          photos: response.data.results,
          totalPhotos: parseInt(response.headers['x-total']),
          currentPage: page,
          loadState: LOAD_STATE.SUCCESS
        });
      })
      .catch(() => {
        this.setState({ loadState: LOAD_STATE.ERROR });
      });
  }
  
  
  render() {
   
    return (
       
      <div className="app">
        <div>
        <input type="text" defaultValue="Search" name="search" id="myText"/>
       <button type="search" onClick={this.myfun}> &#128269;
        </button>
        </div>
        <div id="value"></div>
        <Pagination
          current={this.state.currentPage}
          total={this.state.totalPhotos} 
          perPage={this.state.perPage} 
          onPageChanged={this.fetchPhotos.bind(this)}
        />
        {this.state.loadState === LOAD_STATE.LOADING
            ? <div className="loader"></div>
            : <List data={this.state.photos} />  
          }
        
      </div>
    )
  }
}

const ListItem = ({ photo }) => {
  return (
    <div key={photo.id} className="grid__item card">
      <div className="card__body">
        <img src={photo.urls.small} alt="" />
      </div>
      <div className="card__footer media">
        <img src={photo.user.profile_image.small} alt="" className="media__obj" />
        <div className="media__body">
          <a href={photo.user.portfolio_url} target="_blank">{ photo.user.name }</a>
        </div>
      </div>
    </div>
  )
}

const List = ({ data }) => {
  var items = data.map(photo => <ListItem key={photo.id} photo={photo}/>);
  return (
    <div className="grid">
      { items }
    </div>
  )
}

class Pagination extends Component {  
  pages() {
    var pages = [];
    for(var i = this.rangeStart(); i <= this.rangeEnd(); i++) {
      pages.push(i)
    };
    return pages;
  }

  rangeStart() {
    var start = this.props.current - this.props.pageRange;
    return (start > 0) ? start : 1
  }

  rangeEnd() {
    var end = this.props.current + this.props.pageRange;
    var totalPages = this.totalPages();
    return (end < totalPages) ? end : totalPages;
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perPage);
  }

  nextPage() {
    return this.props.current + 1;
  }

  prevPage() {
    return this.props.current - 1;
  }
  
  hasFirst() {
    return this.rangeStart() !== 1
  }

  hasLast() {
    return this.rangeEnd() < this.totalPages();
  }

  hasPrev() {
    return this.props.current > 1;
  }

  hasNext() {
    return this.props.current < this.totalPages();
  }

  changePage(page) {
    this.props.onPageChanged(page);
  }

  render() {
    return (
      <div className="pagination">
        <div className="pagination__left">
          <a href="#" className={!this.hasPrev() ? 'hidden': ''}
            onClick={e => this.changePage(this.prevPage())}
          >Prev</a>
        </div>

        <div className="pagination__mid">
          <ul>
            <li className={!this.hasFirst() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(1)}>1</a>
            </li>
            <li className={!this.hasFirst() ? 'hidden' : ''}>...</li>
            {
              this.pages().map((page, index) => {
                return (
                  <li key={index}>
                    <a href="#"
                      onClick={e => this.changePage(page)}
                      className={ this.props.current == page ? 'current' : '' }
                    >{ page }</a>
                  </li>
                );
              })
            }
            <li className={!this.hasLast() ? 'hidden' : ''}>...</li>
            <li className={!this.hasLast() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(this.totalPages())}>{ this.totalPages() }</a>
            </li>
          </ul>
        </div>

        <div className="pagination__right">
          <a href="#" className={!this.hasNext() ? 'hidden' : ''}
            onClick={e => this.changePage(this.nextPage())}
          >Next</a>
        </div>
      </div>
    );    
  }
};

Pagination.defaultProps = {
  pageRange: 2
}


export default App;
