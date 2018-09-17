import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { deletePost, addLike, removeLike } from "../../actions/postActions";
import { Link } from "react-router-dom";

class PostItem extends Component {
  onDeleteClick = id => () => {
    this.props.deletePost(id);
  };
  onLikeClick = id => () => {
    this.props.addLike(id);
  };
  onUnLikeClick = id => () => {
    this.props.removeLike(id);
  };
  findUserLike = likes => {
    const { auth } = this.props;
    return likes.likes.filter(like => like.user === auth.user.id).length > 0;
  };
  render() {
    const { post, auth, showActions } = this.props;
    return (
      <div className="posts">
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <a href="profile.html">
                <img
                  className="rounded-circle d-none d-md-block"
                  src={post.avatar}
                  alt={post.name}
                />
              </a>
              <br />
              <p className="text-center">{post.name}</p>
            </div>
            <div className="col-md-10">
              <p className="lead">{post.text}</p>
              {showActions && (
                <span>
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    onClick={this.onLikeClick(post._id)}
                  >
                    <i
                      className={classnames("fas fa-thumbs-up", {
                        "text-info": this.findUserLike(post.likes)
                      })}
                    />
                    <span className="badge badge-light">
                      {post.likes.ammount}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    onClick={this.onUnLikeClick(post._id)}
                  >
                    <i className="text-secondary fas fa-thumbs-down" />
                  </button>
                  <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                    Comments
                  </Link>
                  {post.user === auth.user.id && (
                    <button
                      onClick={this.onDeleteClick(post._id)}
                      type="button"
                      className="btn btn-danger mr-1"
                    >
                      <i className="fas fa-times" />
                    </button>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

PostItem.defaultProps = {
  showActions: true
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem);
