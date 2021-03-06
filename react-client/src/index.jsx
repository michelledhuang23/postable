import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header.jsx';
import EditorModal from './components/EditorModal.jsx';
import Feed from './components/Feed.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      modalIsOpen: false,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onCreatePost = this.onCreatePost.bind(this);
  }

  componentDidMount() {
    const id = window.location.pathname.substring(6);
    this.userId = id;
    const max = 3;
    const min = 1;
    let url;
    if (id > max || id < min) {
      url = '/posts/1';
    } else {
      url = `/posts/${id}`
    }
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then(posts => {
        this.setState({posts});
      })
      .catch((err) => {
        console.error(err);
      })
  }

  onCreatePost(text, tags) {
    fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.userId,
        content: text,
        tags: tags,
      })
    })
    .then(() => {
      window.location.reload(false);
    })
    .catch((err) => {
      console.error(err);
    })
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render () {
    return (<div>
      <Header onCompose={this.openModal} id={this.userId}/>
      <EditorModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onCreatePost={this.onCreatePost}
          />
      <Feed posts={this.state.posts}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));