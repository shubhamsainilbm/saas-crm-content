import mongoose from "mongoose";

const PermissionsSchema = new mongoose.Schema({
  permissionRole: {
    type: String,
    require: true,
  },
  permissionType: {
    view: {
      createJob: {
        type: Boolean,
        default: false,
      },
      updateJob: {
        type: Boolean,
        default: false,
      },
      deleteJob: {
        type: Boolean,
        default: false,
      },
      keyword: {
        type: Boolean,
        default: false,
      },
      blogTitle: {
        type: Boolean,
        default: false,
      },
      products: {
        type: Boolean,
        default: false,
      },
      alliedkeyword: {
        type: Boolean,
        default: false,
      },
      questions: {
        type: Boolean,
        default: false,
      },
      interlinkingBlogs: {
        type: Boolean,
        default: false,
      },
      priority: {
        type: Boolean,
        default: false,
      },
      comments: {
        type: Boolean,
        default: false,
      },
      downloadDocket: {
        type: Boolean,
        default: false,
      },
      createdBy: {
        type: Boolean,
        default: false,
      },
      createdOn: {
        type: Boolean,
        default: false,
      },
      allocatedTo: {
        type: Boolean,
        default: false,
      },
      evaluatedBy: {
        type: Boolean,
        default: false,
      },
      wordCount: {
        type: Boolean,
        default: false,
      },
      scoreGivenByEvaluator: {
        type: Boolean,
        default: false,
      },
      dateOfpublishing: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Boolean,
        default: false,
      },
      url: {
        type: Boolean,
        default: false,
      },
      paidOn: {
        type: Boolean,
        default: false,
      },
      blogDocument: {
        type: Boolean,
        default: false,
      },
      grammarlyScreenshot: {
        type: Boolean,
        default: false,
      },
      keywordAnalystAndAuthorChat: {
        type: Boolean,
        default: false,
      },
      evaluatorAndAuthorChat: {
        type: Boolean,
        default: false,
      },
      activeMember: {
        type: Boolean,
        default: false,
      },
      jobListing: {
        type: Boolean,
        default: false,
      },
      jobClose: {
        type: Boolean,
        default: false,
      },
    },
    edit: {
      keyword: {
        type: Boolean,
        default: false,
      },
      blogTitle: {
        type: Boolean,
        default: false,
      },
      products: {
        type: Boolean,
        default: false,
      },
      alliedkeyword: {
        type: Boolean,
        default: false,
      },
      questions: {
        type: Boolean,
        default: false,
      },
      interlinkingBlogs: {
        type: Boolean,
        default: false,
      },
      priority: {
        type: Boolean,
        default: false,
      },
      comments: {
        type: Boolean,
        default: false,
      },
      // downloadDocket: {
      //   title: {
      //     type: String,
      //     default: "download-docket",
      //   },
      //   isPermission: {
      //     type: Boolean,
      //     default: false,
      //   },
      // },
      // createdBy: {
      //   title: {
      //     type: String,
      //     default: "created-by",
      //   },
      //   isPermission: {
      //     type: Boolean,
      //     default: false,
      //   },
      // },
      // createdOn: {
      //   title: {
      //     type: String,
      //     default: "created-on",
      //   },
      //   isPermission: {
      //     type: Boolean,
      //     default: false,
      //   },
      // },
      allocatedTo: {
        type: Boolean,
        default: false,
      },
      evaluatedBy: {
        type: Boolean,
        default: false,
      },
      wordCount: {
        type: Boolean,
        default: false,
      },
      scoreGivenByEvaluator: {
        type: Boolean,
        default: false,
      },
      dateOfpublishing: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Boolean,
        default: false,
      },
      url: {
        type: Boolean,
        default: false,
      },
      paidOn: {
        type: Boolean,
        default: false,
      },
      blogDocument: {
        type: Boolean,
        default: false,
      },
      grammarlyScreenshot: {
        type: Boolean,
        default: false,
      },
      keywordAnalystAndAuthorChat: {
        type: Boolean,
        default: false,
      },
      evaluatorAndAuthorChat: {
        type: Boolean,
        default: false,
      },
      activeMember: {
        type: Boolean,
        default: false,
      },
    },
  },
});

export default mongoose.model("Permissions", PermissionsSchema);
