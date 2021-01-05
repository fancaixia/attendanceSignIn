import React from 'react';
import { NavBar,Icon} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import AttendanceCard from '../../components/attendanceCard'

class Attendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentWillMount() {

     }
    componentDidMount() {

    }
   
    // 跳转到考勤打卡页面
    gotocard = (type) => {
      this.props.history.push(`/attendanceMap?signType=${type}`)
    }

    render() {

        let {    } = this.state;

        return (
            <div className="attendance_home course_common_name">
               
                <NavBar mode="light">
                    考勤打卡
                </NavBar>
               
                <div className="attend_card_box">
                  <AttendanceCard
                     gotocard = {this.gotocard}
                     onRef={c=>this.ChildPage=c}
                     ></AttendanceCard>
                </div>

            </div>
        )
    }
}

export default Attendance;