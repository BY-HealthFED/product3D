import { h, Component } from 'preact';
import s from './Spin.scss';

class Spin extends Component {
	render() {
		const {spinBgColor, spinColor, spinHeight, spinWidth} = this.props;
		return (
			<div style={{backgroundColor:spinBgColor}} className={`${s.uildefaultcss} ${s.block}`} {...this.props}>
				<div className={`${s.ela} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elb} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elc} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.eld} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.ele} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elf} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elg} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elh} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.eli} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elj} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elk} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.ell} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
				<div className={`${s.elm} ${s.element}`} style={{backgroundColor:spinColor, height:spinHeight, width:spinWidth}}></div>
			</div>
		);
	}
}

export default Spin;
