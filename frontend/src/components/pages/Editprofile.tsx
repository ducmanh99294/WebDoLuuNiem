import '../../assets/css/Editprofile.css';

const EditProfile = () => {
  return (
    <div className="edit-profile-container">
      <h2>Edit your profile</h2>
      <form className="edit-profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Address Line 1</label>
          <input type="text" />
        </div>

        <div className="form-group full-width">
          <label>Address Line 2</label>
          <input type="text" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" />
          </div>
        </div>

        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
