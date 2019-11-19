import React, { Component } from "react";
import { Tooltip } from "@material-ui/core";
import moment from "moment";
import api from "../services/api";
import Loader from "react-loader-spinner";
import "../assets/styles/Graph.scss";

export class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      days: [],
      daysOfWeek: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],
      weeks: [],
      max_value: 0,
      data: []
    };
    this.handleDate = this.handleDate.bind(this);
  }
  findMax() {
    let max = Math.max(...this.state.days);
    return max;
  }
  async componentDidMount() {
    const { weeks } = this.state;
    await api
      .get("/repos/brunim1101/empresas-bruno/stats/commit_activity")
      .then(res => {
        res.data.map((item, index) => {
          weeks.push(item.days);
        });
        this.setState({ data: res.data, loading: false });
      })
      .catch(error => {
        console.log(error);
      });
    for (let i = 0; i < 52; i++) {
      for (let j = 0; j < 7; j++) {
        const { days } = this.state;
        days.push(this.state.weeks[i][j]);
      }
    }
    this.setState({ max_value: this.findMax() });
  }
  rankColor(value) {
    let max = this.state.max_value;
    let half = max / 2;
    let anotherHalf = half / 2;
    if (value === 0) {
      return "#ebedf0";
    }
    if (value <= anotherHalf) {
      return "#c6e48b";
    }
    if (value <= half) {
      return "#7bc96f";
    }
    if (value <= half + anotherHalf) {
      return "#239a3b";
    }
    if (value <= max) {
      return "#196127";
    } else return "red";
  }
  handleDate(weekUnixTime, index) {
    let date = moment.unix(weekUnixTime);
    let day = date.add(index, "days");
    return day;
  }
  writeMonth(weekUnix) {
    let date = moment.unix(weekUnix);
    let day = date.add(6, "days");
    let month = 0;
    if (date.month() > day.month()) {
      month = day.month() + 1;
    } else month = date.month() + 1;
    switch (month) {
      case 1:
        return "Jan";
      case 2:
        return "Fev";
      case 3:
        return "Mar";
      case 4:
        return "Abr";
      case 5:
        return "Mai";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Ago";
      case 9:
        return "Set";
      case 10:
        return "Out";
      case 11:
        return "Nov";
      case 12:
        return "Dez";
      default:
        return "Erro";
    }
  }
  valueForMonth(value) {
    if (value < 40) {
      return "4";
    } else return "5";
  }
  render() {
    return (
      <>
        {this.state.loading ? (
          <Loader type="Oval" color="black" height={80} width={80} />
        ) : (
            <div className="table">
              <table>
                <tr>
                  {this.state.data.map((week, index) =>
                    index % 4 === 0 ? (
                      <th colSpan={this.valueForMonth(index)}>
                        {this.writeMonth(week.week)}
                      </th>
                    ) : null
                  )}
                </tr>
                {this.state.daysOfWeek.map((day, index) => (
                  <tr>
                    <td>{day}</td>
                    {this.state.data.map((week, index2) => (
                      <td>
                        <svg width="15" height="15">
                          <Tooltip
                            placement="top"
                            title={
                              "Contribuições: " +
                              week.days[index] +
                              " Dia: " +
                              this.handleDate(week.week, index).date() +
                              " Mês: " +
                              (this.handleDate(week.week, index).month() + 1)
                            }
                          >
                            <rect
                              style={{
                                fill: this.rankColor(week.days[index]),
                                width: "15px",
                                height: "15px"
                              }}
                            />
                          </Tooltip>
                        </svg>
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
              <div className="subtitle">
                <p>Less </p>
                <svg width="100px" height="20px">
                  <rect
                    style={{
                      fill: "#c6e48b",
                      width: "15px",
                      height: "15px"
                    }}
                    x="20"
                  />
                  <rect
                    style={{
                      fill: "#7bc96f",
                      width: "15px",
                      height: "15px"
                    }}
                    x="40"
                  />
                  <rect
                    style={{
                      fill: "#239a3b",
                      width: "15px",
                      height: "15px"
                    }}
                    x="60"
                  />
                  <rect
                    style={{
                      fill: "#196127",
                      width: "15px",
                      height: "15px"
                    }}
                    x="80"
                  />
                  <rect
                    style={{
                      fill: "#ebedf0",
                      width: "15px",
                      height: "15px"
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

