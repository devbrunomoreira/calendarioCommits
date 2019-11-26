import React, { Component } from 'react';
import { Tooltip } from '@material-ui/core';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import api from '../services/api';
import '../assets/styles/Graph.scss';

function writeMonth(yearMonth) {
  const month = yearMonth.split('').splice(5).join();
  if (month === '1') {
    return 'Jan';
  }
  if (month === '2') {
    return 'Fev';
  }
  if (month === '3') {
    return 'Mar';
  }
  if (month === '4') {
    return 'Abr';
  }
  if (month === '5') {
    return 'Mai';
  }
  if (month === '6') {
    return 'Jun';
  }
  if (month === '7') {
    return 'Jul';
  }
  if (month === '8') {
    return 'Ago';
  }
  if (month === '9') {
    return 'Set';
  }
  if (month === '1,0') {
    return 'Out';
  }
  if (month === '1,1') {
    return 'Nov';
  }
  if (month === '1,2') {
    return 'Dez';
  }
  return 'Erro';
}
function handleDate(weekUnixTime, index) {
  const date = moment.unix(weekUnixTime);
  const day = date.add(index, 'days');
  return day;
}
function getMonth(weekUnix) {
  const date = moment.unix(weekUnix);
  return date.month() + 1;
}
function getYear(weekUnix) {
  const date = moment.unix(weekUnix);
  return date.year();
}
export class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      daysOfWeek: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
      maxValue: 0,
      data: [],
      tableMonth: [],
    };
  }

  async componentDidMount() {
    await api
      .get('/repos/facebook/react-native/stats/commit_activity')
      .then(res => {
        const newWeeks = res.data.reduce((acc, item) => [...acc, item], []);
        let maxV = 0;
        const table = [];
        newWeeks.forEach(week => {
          const month = getMonth(week.week);
          const year = getYear(week.week);
          if (table[`${year}/${month}`]) {
            table[`${year}/${month}`].push(week);
          } else {
            table[`${year}/${month}`] = [week];
          }
        });
        for (let i = 0; i < 52; i += 1) {
          for (let j = 0; j < 7; j += 1) {
            if (newWeeks[i].days[j] > maxV) {
              maxV = newWeeks[i].days[j];
            }
          }
        }
        this.setState({
          data: res.data, loading: false, maxValue: maxV, tableMonth: table,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  rankColor(value) {
    const { maxValue } = this.state;
    const max = maxValue;
    const half = max / 2;
    const anotherHalf = half / 2;
    if (value === 0) {
      return '#ebedf0';
    }
    if (value <= anotherHalf) {
      return '#c6e48b';
    }
    if (value <= half) {
      return '#7bc96f';
    }
    if (value <= half + anotherHalf) {
      return '#239a3b';
    }
    if (value <= max) {
      return '#196127';
    }
    return 'red';
  }

  render() {
    const { loading } = this.state;
    const { daysOfWeek } = this.state;
    const { data } = this.state;
    const { tableMonth } = this.state;
    return (
      <>
        {loading ? (
          <Loader type="Oval" color="black" height={80} width={80} />
        ) : (
          <div className="container">
            <table className="table">
              <tbody>
                <tr>
                  {Object.keys(tableMonth).map(key => (
                    <td
                      colSpan={tableMonth[key].length}
                    >
                      {writeMonth(key)}
                    </td>
                  ))}
                </tr>
                {daysOfWeek.map((day, index) => (
                  <tr key={JSON.stringify(day)}>
                    <td>{day}</td>
                    {data.map(week => (
                      <td key={JSON.stringify(week)}>
                        <svg width="15" height="15">
                          <Tooltip
                            placement="top"
                            title={`Contribuições: ${
                              week.days[index]
                            } Dia: ${handleDate(
                              week.week,
                              index + 1,
                            ).date()} Mês: ${handleDate(
                              week.week,
                              index + 1,
                            ).month() + 1}`}
                          >
                            <rect
                              style={{
                                fill: this.rankColor(week.days[index]),
                                width: '15px',
                                height: '15px',
                              }}
                            />
                          </Tooltip>
                        </svg>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="subtitle">
              <p>Less &nbsp;</p>
              <svg width="100px" height="20px">
                <rect
                  style={{
                    fill: '#c6e48b',
                    width: '15px',
                    height: '15px',
                  }}
                  x="20px"
                />
                <rect
                  style={{
                    fill: '#7bc96f',
                    width: '15px',
                    height: '15px',
                  }}
                  x="40px"
                />
                <rect
                  style={{
                    fill: '#239a3b',
                    width: '15px',
                    height: '15px',
                  }}
                  x="60px"
                />
                <rect
                  style={{
                    fill: '#196127',
                    width: '15px',
                    height: '15px',
                  }}
                  x="80px"
                />
                <rect
                  style={{
                    fill: '#ebedf0',
                    width: '15px',
                    height: '15px',
                  }}
                />
              </svg>
              <p>More</p>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Graph;
