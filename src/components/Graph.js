/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { Tooltip } from '@material-ui/core';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import api from '../services/api';
import '../assets/styles/Graph.scss';

function writeMonth(weekUnix) {
  const date = moment.unix(weekUnix);
  const day = date.add(6, 'days');
  let month = 0;
  if (date.month() > day.month()) {
    month = day.month() + 1;
  } else month = date.month() + 1;
  switch (month) {
    case 1:
      return 'Jan';
    case 2:
      return 'Fev';
    case 3:
      return 'Mar';
    case 4:
      return 'Abr';
    case 5:
      return 'Mai';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Ago';
    case 9:
      return 'Set';
    case 10:
      return 'Out';
    case 11:
      return 'Nov';
    case 12:
      return 'Dez';
    default:
      return 'Erro';
  }
}
function valueForMonth(value) {
  if (value < 40) {
    return '4';
  }
  return '5';
}
function handleDate(weekUnixTime, index) {
  const date = moment.unix(weekUnixTime);
  const day = date.add(index, 'days');
  return day;
}
export class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      daysOfWeek: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
      maxValue: 0,
      data: [],
    };
  }

  async componentDidMount() {
    await api
      .get('/repos/brunim1101/empresas-bruno/stats/commit_activity')
      .then(res => {
        const newWeeks = res.data.reduce((acc, item) => [...acc, item], []);
        let maxV = 0;
        for (let i = 0; i < 52; i += 1) {
          for (let j = 0; j < 7; j += 1) {
            if (newWeeks[i].days[j] > maxV) {
              maxV = newWeeks[i].days[j];
            }
          }
        }
        this.setState({ data: res.data, loading: false, maxValue: maxV });
      })
      .catch(error => {
        console.log(error);
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
    return (
      <>
        {loading ? (
          <Loader type="Oval" color="black" height={80} width={80} />
        ) : (
          <div className="table">
            <table>
              <tbody>
                <tr>
                  {data.map(
                    (week, index) => index % 4 === 0 && (
                        <th
                          key={JSON.stringify(week)}
                          colSpan={valueForMonth(index)}
                        >
                          {writeMonth(week.week)}
                        </th>
                      ),
                  )}
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
                              index,
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
