import React from 'react';

import Imgdefplace from '../../images/attend_site_icon.png'
import AttendSign from '../../images/attend_sign_back.png'

import './style.scss'

function getTime() {
    var now = new Date();
    //获取当前小时
    var hour = now.getHours()<10?'0'+now.getHours():now.getHours();
    //获取当前分钟
    var minutes = now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
    //获取当前秒
    var seconds = now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds(); 
    var time1 = hour+":"+minutes+":"+seconds;
    return time1;
}

class AttendanceCardComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myattendanceData:{},        // 打卡数据
            currentTime:getTime(),             // 时间计时器
            
        };
    }
    componentWillMount() {        
       // 时间定时器
       this.timeId = setInterval(()=>{
            this.setState({
                currentTime:getTime()
            })
            
        },1000)
     }
    componentDidMount() {
    }
    componentWillUnmount() {
        clearInterval(this.timeId)
    }
    componentWillReceiveProps(nextProps) {

    }


    // 跳转到考勤打卡页面
    gotoattendcard = (type) => {
   
        window.localStorage.setItem('actAttendanceInfo',JSON.stringify({
            jd: "116.295691",   // 测试 精度
            wd: "40.052094",    // 测试 纬度
            range:'1000',       // 当前地点距离考勤地点范围
        }))

        this.props.gotocard(type)
    }
   
    render() {
        let {
            currentTime,
            } = this.state;

        return (
            <div className="attendance_cardComp course_common_name">
                <div className="plan_list_box">
                        <div className="plan_list_attend">
                            <span className="line_circle"></span>
                            <div className="plan_center">
                                <p className="signTime"> 签到时间 08:30:00 - 09:00:00</p>
                                <p><img style={{display:'inline-block',marginRight:'0.2rem',width:'0.36rem',verticalAlign: "middle"}} src={Imgdefplace}></img>北京市海淀区西二旗软件园一期18号楼</p>
                            </div>
                            <div className="plan_center">
                               <div className='attend_sign_btn'>
                                <p className="sign_time">签到打卡<span style={{display:'block'}}>{currentTime}</span></p>
                                    <img className="sign_bg" onClick={()=>{
                                    this.gotoattendcard(1)
                                }} src={AttendSign}></img>
                                </div>
                              </div>
                        </div>
                        <div className="plan_list_attend">
                            <span className="line_circle"></span>
                           <div className="plan_center">
                                <p className="signTime"> 签退时间 16:30:00 - 15:00:00</p>
                                <p><img style={{display:'inline-block',marginRight:'0.2rem',width:'0.36rem',verticalAlign: "middle"}} src={Imgdefplace}></img>北京市海淀区西二旗软件园一期18号楼</p>
                            </div>
                           
                          </div>
                </div>

                <div >

                </div>

            </div>
        )
    }
}

export default AttendanceCardComp;