import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onDeleteClick = id => () => {
    this.props.deleteExperience(id);
  };

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="MM-DD-YYYY">{exp.from}</Moment>
          {" - "}
          {exp.current ? (
            "Present"
          ) : (
            <Moment format="MM-DD-YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onDeleteClick(exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    );
  }
}

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
