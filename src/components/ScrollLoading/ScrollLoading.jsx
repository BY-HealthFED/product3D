import { h, Component } from 'preact';
import s from './ScrollLoading.scss';

class ScrollLoading extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showLoading: false,
			pageOver: false,
			showNoMore: false,
			stopBack: false,
			showScrollToTop: false
		};

		this.timerScrollLockInit = null;
		this.timerNoMore = null;
		this.timerScrollToTopRun = null;

		this.scrollLocked = false;
	}

	componentWillUnmount() {
		window.clearTimeout(this.timerNoMore);
		window.clearTimeout(this.timerScrollLockInit);
		window.clearInterval(this.timerScrollToTopRun);
	}

	scrollLockInit = () => {
		window.clearTimeout(this.timerScrollLockInit);
		this.timerScrollLockInit = window.setTimeout(() => {
			this.scrollLocked = false;
			// 这里让滚动条回退1px是为了使每次下拉都可以触发触底动作
			this.refWarp.scrollTop--;
		}, 200);
	}

	showLoadingBar = () => new Promise((resolve) => {
		this.setState({
			showLoading: true
		}, resolve());
	});

	hideLoadingBar = () => new Promise((resolve) => {
		this.setState({
			showLoading: false
		}, resolve());
	});

	lockedScroll = () => new Promise((resolve) => {
		this.setState({
			showLoading: false
		}, resolve());
	});

	onScroll = (e) => {
		const {
			handlePage, totalSize, currentPage, pagesize,
			scrollToTop
		} = this.props;

    // 滚动条当前的高度
		const scrollTop = e.currentTarget.scrollTop + 5;
    // 外框高度
		const boxHeight = e.currentTarget.offsetHeight;
    // 内容高度
		const contentHeight = e.currentTarget.childNodes[0].offsetHeight;
		// 翻页是否结束
		if (!this.state.pageOver) {
			// 页面是否触底
			if (scrollTop + boxHeight >= contentHeight) {

				if (!this.scrollLocked) {
					// 锁定滚动
					this.scrollLocked = true;

					// 事件流 显示loading -> 操作翻页 -> 隐藏loading -> 初始化滚动状态／关闭
					Promise.resolve()
					.then(this.showLoadingBar)
					.then(handlePage)
					.then(this.hideLoadingBar)
					.then(this.scrollLockInit)
					.catch(() => {
						this.scrollLockInit();
						this.setState({
							pageOver: true,
							showLoading: false
						});
					});
				}

				// 计算页面总数是否翻完关闭滚动
				if (totalSize <= (currentPage * pagesize)) {
					this.setState({
						pageOver: true,
						showLoading: false
					});
				}

			}
		} else if (scrollTop + boxHeight >= contentHeight) {
			// 处理已关闭翻页的状态
			if (!this.scrollLocked) {
				this.scrollLocked = true;
				Promise.resolve()
				.then(this.displayNoMore)
				.then(this.scrollLockInit);
			}
		}
		if (scrollToTop) {
			this.displayScrollToTop();
		}
	}

	onScrollToTop = () => {
		this.ScrollToTopRun();
	}

	ScrollToTopRun = () => {
		window.clearInterval(this.timerScrollToTopRun);
		this.timerScrollToTopRun = setInterval(() => {
			if (this.refWarp.scrollTop === 0) {
				window.clearInterval(this.timerScrollToTopRun);
				return;
			}
			let speed = this.refWarp.scrollTop / 8;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			this.refWarp.scrollTop -= speed;
		}, 30);
	}

	displayScrollToTop = () => {
		const windowHeight = window.innerHeight;
		const scrollTop = this.refWarp.scrollTop;
		if (scrollTop > windowHeight) {
			this.setState({
				showScrollToTop: true
			});
		} else {
			this.setState({
				showScrollToTop: false
			});
		}
	}

	displayNoMore = () => new Promise((resolve) => {
		clearInterval(this.timerNoMore);
		this.setState(
			{showNoMore: true},
			() => {
				this.timerNoMore = setTimeout(() => {
					this.setState(
						{showNoMore: false},
						resolve()
					);
				}, 1000);
			}
		);}
	)

	renderScrollToTopFlag = () => {
		const { scrollToTop } = this.props;
		const defaultHtml = (
			<div className={s.backtotop}>
				<i className="icon_arrow_up"></i>
			</div>
		);

		if (typeof this.props.scrollToTop === 'boolean' && scrollToTop) {
			return defaultHtml;
		}

		if (typeof this.props.scrollToTop === 'function' && scrollToTop) {
			return scrollToTop;
		}

		return null;
	}

	renderLoading = () => {
		const {loadingHtml} = this.props;
		if (loadingHtml) {
			return loadingHtml;
		}
		return (
			<div className={s.SLoading}>
				<div className={`${s.listloading} center al-c`} >
					<div><div /></div><div><div /></div>
					<div><div /></div><div><div /></div>
					<div><div /></div><div><div /></div>
					<div><div /></div><div><div /></div>
				</div>
				<div className="gray-light al-c pd1 font-smallest">加载中</div>
			</div>
		);
	}

	renderNoMore = () => {
		const {noMoreHtml} = this.props;
		if (noMoreHtml) {
			return noMoreHtml;
		}
		return (<div
			className={`gray-light al-c font-smallest ${s.nomoren}`}
		>
			没有了</div>);
	}

	render() {
		const { children } = this.props;
		const { showScrollToTop, showLoading, showNoMore } = this.state;
		return (
      <div
				ref={this.props.inRef}
				className={s.scrollLoadingWrap}
			>
        <div
					className={s.scrollLoading}
					onScroll={this.onScroll}
					ref={(ref) => { this.refWarp = ref; }}
				>
          <div>
            {children}
            {
              showLoading ?
                this.renderLoading() :
              null
            }
						{
							showNoMore ?
							this.renderNoMore() :
							null
						}
          </div>
        </div>
				<div onClick={this.onScrollToTop} >
					{showScrollToTop ? this.renderScrollToTopFlag() : null}
				</div>
      </div>
		);
	}
}

export default ScrollLoading;
