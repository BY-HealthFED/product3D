import { h, Component } from 'preact';
import style from './style.less';
import Modal from '~/components/Modal';
import Loading from '~/components/Loading';

export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			count: 0,
			isOpen: false
		};
	}

	componentWillMount () {
	}


	// update the current time
	updateTime = () => {
		let time = new Date().toLocaleString();
		this.setState({ time });
	};

	// Model
	handleOpenModal = () => {
		this.setState({isOpen: true});
	}

	handleHideModal = () => {
		this.setState({isOpen: false});
	}

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
		this.updateTime();

		// every time we get remounted, increment a counter:
		this.setState({ count: this.state.count+1 });
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	showLoading = () => {
		Loading.show();
		setTimeout(() => {
			Loading.hide();
		}, 3000);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<p>This is the user profile for a user named {user}.</p>

				<div>Current time: {time}</div>
				<div>Profile route mounted {count} times.</div>
				<br /><br />
				<button className="pd1 bg-gray-light" onClick={this.handleOpenModal}>OpenModal</button>
				<br /><br />
				<button className="pd1 bg-gray-light" onClick={this.showLoading}>Loading</button>
				<Modal
					isOpen={this.state.isOpen}
					contentLabel="Modal"
					onRequestClose={this.handleHideModal}
				>
					<div className="pd1 al-c">
						<h2> Modal </h2>
						<br />
					</div>
				</Modal>
			</div>
		);
	}
}

