const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.rederNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {
        path: "author",
    },}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing You requested, does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res,next ) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing created!!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing You requested, does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_100");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listings");
    }
    let {id} = req.params;

    if(typeof req.file != "undefined") {
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated!!");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!!");
    res.redirect("/listings");
};
