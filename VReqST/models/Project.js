/* Collectionname: Proj
{
Projid: <identifier>,
Ownerid:< identifier – from person:pid >,
CreatedTime: < timestamp >,
Status: <String>,
Step:<String>,
IsFinished: <String>,
LstUpd: <timestamp>
}
 */

const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    grammarName: {
      type: String,
      required: false,
    },
    ownerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    step: {
      type: Number,
      default: 0,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: String,
      default: "",
    },
    asset: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      default: "",
    },
    custom: {
      type: String,
      default: "",
    },
    timeline: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
