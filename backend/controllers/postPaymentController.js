import asyncHandler from 'express-async-handler';



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const postPaymentController = asyncHandler(async (req, res) => {
    console.log(req);
    console.log(req.body);

  
    // if (user) {
    //   res.json({
    //     _id: user._id,
    //     name: user.name,
    //     surname: user.surname,
    //     email: user.email,
    //     cellNumber: user.cellNumber,
    //     emailIsVerified: user.emailIsVerified,
    //     numberIsVerified: user.numberIsVerified,
    //     terms: user.terms,
    //   });
    // } else {
    //   res.status(404);
    //   throw new Error('User not found');
    // }
  });

  export {
    postPaymentController,
  };