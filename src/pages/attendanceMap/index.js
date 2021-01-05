import React from 'react';

import { Button, NavBar, Icon, Modal,} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

import './style.scss'

import AttendSignCom from '../../images/attend_card_back.png'
import Imgdefplace from '../../images/attend_site_icon.png'
import MyposImg from '../../images/attend_location_my.png'
import AttendSignImg from '../../images/attend_location_other.png'
import AttendSignpos from '../../images/attend_ location_icon.png'

let geolocation = null;

function getSearchParamByKey(key) {
    var url = window.location.href;
    key = key.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class AttendanceCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            inrange:false,          // 1不在   2在考勤范围内
            myaddress:'',          // 我的位置
            currentTime:'',
            showattendance:false,   // 打卡提示信息
            signattendTime:'',     // 打卡时的时间
            mypoint:{},             // 记录我的坐标
        };
    }
    componentWillMount() {
        // console.log(window.localStorage.getItem('actAttendanceInfo'),":经纬度")
        this.setState({
            actAttendanceInfo:JSON.parse(window.localStorage.getItem('actAttendanceInfo')),
            signType:getSearchParamByKey('signType')
        })
     }
    componentDidMount() {
        const {BMap,BMAP_STATUS_SUCCESS,BMAP_ANCHOR_TOP_LEFT}=window;
        var map = new BMap.Map("allmap");            // 创建Map实例
        this.map = map;

        setTimeout(()=>{
            this.checklocal(map);
        },500)
        // 时间定时器
        this.timeId = setInterval(()=>{
            this.setState({
                currentTime:this.getTime()
            })
            
        },1000)
        // 位置定时获取
        this.postime = setInterval(()=>{
            this.reloadPos()
        },5000)

    }
    getTime = () => {
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

    // 重绘我的位置函数
    reloadPos = () => {
        let { actAttendanceInfo, mypoint } = this.state
            const {BMap,BMAP_STATUS_SUCCESS,BMAP_ANCHOR_TOP_LEFT}=window;
            // 定位
            const _$that = this;
            const map = this.map;
              
            if(!geolocation){
                geolocation = new BMap.Geolocation();
            }
            
            geolocation.getCurrentPosition(function(r){
 
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    _$that.setState({
                        loading:false,
                    })
                    // console.log('您的位置：',r);
                    // 删除之前的标注
                    if(mypoint.lng && (mypoint.lng != r.point.lat && mypoint.lng != r.point.lat)){
                        var allOverlay = map.getOverlays();
                        for(var i = 0;i<allOverlay.length;i++) {
                            if(allOverlay[i].toString()=="[object Marker]"){
                                if (allOverlay[i].getPosition().lng == mypoint.lng && allOverlay[i].getPosition().lat == mypoint.lat) {
                                map.removeOverlay(allOverlay[i]);
                                }
                            }
                        }

                        // 创建新的标注开始
                        var pt2 = new BMap.Point(r.point.lng , r.point.lat );
                        // var pt2 = new BMap.Point(116.294211,40.052504 );

                        var myIcon2 = new BMap.Icon(MyposImg, new BMap.Size(42,53));
                        var marker2 = new BMap.Marker(pt2,{icon:myIcon2});  // 创建标注
                        marker2.setTop(true,27000000);
                        map.addOverlay(marker2);

                        var points = [{"lng":actAttendanceInfo.jd,"lat":actAttendanceInfo.wd,"status":1,"id":50},  
                        {"lng":r.point.lng,"lat":r.point.lat,"status":1,"id":5}  
                        ];   
                        var view = map.getViewport(eval(points));  
                        var mapZoom = view.zoom;   
                        var centerPoint = view.center;   
                        map.centerAndZoom(centerPoint,mapZoom);  

                        // 使用经纬度换取 位置信息
                        var geoc = new BMap.Geocoder();   
                        geoc.getLocation(pt2, function(posrs){
                            // console.log(posrs,":posrs")
                            _$that.setState({
                                myaddress: posrs.address,
                                mypoint:r.point,
                                // mypoint:{
                                //     lng: 116.294211,
                                //     lat: 40.052504
                                // },

            
                            },()=>{
                                // 计算是否在考勤范围内
                                // var pointA = new BMap.Point(r.point.lng , r.point.lat);  // 学员位置
                                var pointB = new BMap.Point(actAttendanceInfo.jd,actAttendanceInfo.wd);     // 活动地点位置
                                let curDistance = (map.getDistance(pt2,pointB)).toFixed(2);
                                // console.log('距离是：',curDistance,);  //获取两点距离,保留小数点后两位
                                if(Number(curDistance) <= Number(actAttendanceInfo.range)){
                                    // console.log('在考勤范围内')
                                    _$that.setState({
                                        inrange:true,
                                    })
                                }else{
                                    // console.log('不在考勤范围内')
                                    _$that.setState({
                                        inrange:false,
                                    })
                                }
                                // 开启定时器  10s 获取一次位置
                            })
                        });  
                        // 创建新的标注结束

                    }else if(!mypoint.lng){
                        // 第一次绘制
                        // 创建新的标注开始
                        var pt2 = new BMap.Point(r.point.lng , r.point.lat );
                        // var pt2 = new BMap.Point(116.294211,40.052504 );

                        var myIcon2 = new BMap.Icon(MyposImg, new BMap.Size(42,53));
                        var marker2 = new BMap.Marker(pt2,{icon:myIcon2});  // 创建标注
                        marker2.setTop(true,27000000);
                        map.addOverlay(marker2);

                        var points = [{"lng":actAttendanceInfo.jd,"lat":actAttendanceInfo.wd,"status":1,"id":50},  
                        {"lng":r.point.lng,"lat":r.point.lat,"status":1,"id":5}  
                        ];   
                        var view = map.getViewport(eval(points));  
                        var mapZoom = view.zoom;   
                        var centerPoint = view.center;   
                        map.centerAndZoom(centerPoint,mapZoom);  

                        // 使用经纬度换取 位置信息
                        var geoc = new BMap.Geocoder();   
                        geoc.getLocation(pt2, function(posrs){
                            // console.log(posrs,":posrs")
                            _$that.setState({
                                myaddress: posrs.address,
                                mypoint:r.point,
                                // mypoint:{
                                //     lng: 116.294211,
                                //     lat: 40.052504
                                // },

            
                            },()=>{
                                // 计算是否在考勤范围内
                                // var pointA = new BMap.Point(r.point.lng , r.point.lat);  // 学员位置
                                var pointB = new BMap.Point(actAttendanceInfo.jd,actAttendanceInfo.wd);     // 活动地点位置
                                let curDistance = (map.getDistance(pt2,pointB)).toFixed(2);
                                // console.log('距离是：',curDistance,);  //获取两点距离,保留小数点后两位
                                if(Number(curDistance) <= Number(actAttendanceInfo.range)){
                                    // console.log('在考勤范围内')
                                    _$that.setState({
                                        inrange:true,
                                    })
                                }else{
                                    // console.log('不在考勤范围内')
                                    _$that.setState({
                                        inrange:false,
                                    })
                                }
                                // 开启定时器  10s 获取一次位置
                            })
                        });  
                        // 创建新的标注结束

                    }
                    
                }
            },{provider:'baidu'})
    }
    // 点击按钮刷新我的位置
    resetMypos = () => {
        // 清除
        clearInterval(this.postime)
        // 重绘一次
        this.reloadPos()
        // 定时器
        this.postime = setInterval(()=>{
            this.reloadPos()
        },5000)

    }

    componentWillUnmount() {
        clearInterval(this.timeId)
        clearInterval(this.postime)
    }
    // 关闭打卡提示
    onClose = () => () => {
        this.setState({
            showattendance:false,
        });
        this.props.history.goBack()
    }
    // 地图检索
    checklocal(map){
        const {BMap,BMAP_STATUS_SUCCESS,BMAP_ANCHOR_TOP_LEFT}=window;
        // 百度地图API功能
        let { actAttendanceInfo } = this.state;
       
        var mPoint = new BMap.Point(actAttendanceInfo.jd , actAttendanceInfo.wd); 
        map.enableScrollWheelZoom();
        map.centerAndZoom(mPoint,15);

        var circle = new BMap.Circle(mPoint,actAttendanceInfo.range,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
        map.addOverlay(circle);

        //创建打卡地点图标
        var pt = new BMap.Point(actAttendanceInfo.jd , actAttendanceInfo.wd);
        var myIcon = new BMap.Icon(AttendSignImg, new BMap.Size(42,53));
        var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        this.reloadPos();
    }
     // 签到打卡
     mysignattendance = () => {
        const {BMap,BMAP_STATUS_SUCCESS,BMAP_ANCHOR_TOP_LEFT}=window;

        let { mypoint, signType } = this.state;

        let newpoint = new BMap.Point(mypoint.lng,mypoint.lat)
        this.setState({
            loading:true,
        })

        // 根据学员位置经纬度 获取地点名称
        var geoc = new BMap.Geocoder();  
        geoc.getLocation(newpoint, function(rs){
            // console.log(rs,":学员位置信息")

               setTimeout(()=>{
                this.setState({
                    loading:false,
                    signattendTime:this.getTime(),
                    showattendance:true,
                })
               },1000)
           
        }); 
        // 获取位置结束

    }

    render() {
        let { 
            loading,
            inrange, 
            myaddress,
            currentTime,
            showattendance,
            signType,
            signattendTime,
            } = this.state;
        return (
            <div className="attendance_card course_common_name">
                {loading?<div className="loading_div">
                  <div className="loading_icon">
                    <Icon size={'lg'} type="loading" />
                    <p>加载中...</p>
                    </div>
                </div>:null}
                <NavBar
                    mode="light"
                    icon={<Icon type="left" size={'md'} />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    考勤打卡
                </NavBar>
                <div className="plan_content">
                    <div id='allmap' style={{
                        width:'100%',
                        height:'500px'
                    }}></div>
                
                </div>

                <div className="plan_foot">
                    <div className="myposbtn">
                        <img src={AttendSignpos}  onClick={this.resetMypos}></img>
                    </div>
                    <p><span style={{fontSize:'0.5rem',color:'#222'}}>我的位置 </span> 
                    <span style={{color:'#0c53a5',fontSize:'0.32rem'}}> ( {inrange?'在考勤范围内':'不在考勤范围内'} )</span> </p>
                    <p style={{marginBottom:'0.4rem',fontSize:'0.28rem'}}> 
                    <img src={Imgdefplace} style={{width:'0.36rem',marginRight:'0.1rem',verticalAlign:'middle'}}></img>
                    {myaddress}</p>
                <Button disabled={!inrange} onClick={this.mysignattendance}> 
                {currentTime} {signType==1?'签到':'签退'} 打卡
                </Button>
                </div>


                {/* 成功的提示 */}
                <Modal
                visible={showattendance}
                transparent
                maskClosable={false}
                onClose={this.onClose()}
                className="attendance_modal"
                title=""
                footer={[{ text: '我知道了', onPress: () => {this.onClose()(); } }]}
                // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                // afterClose={() => { alert('afterClose'); }}
                >
                <div className="">
                <img style={{width:'100%'}} src={AttendSignCom}></img> 
                <p style={{color:'#0c53a5',fontSize:'0.8rem',position:'relative',top:'-0.3rem'}}>{signattendTime}</p>
                <p style={{color:'#0c53a5'}}>{signType== 1?'签到':'签退'}打卡成功</p>
                </div>
                </Modal>


            </div>
        )
    }
}

export default AttendanceCard;