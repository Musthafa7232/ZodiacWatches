const orderModel = require('../Models/orderSchema')
const puppeteer = require('puppeteer')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')

const makeInvoice = async (req, res, next) => {
  try {
    const id = req.params.id
    const orderDetails = await orderModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id)
        }
      }, {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      }, {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'couponId'
        }
      }, {
        $unwind: '$userId'

      }
    ])
    const order = orderDetails[0]
    console.log(order)
    const file = await ejs.renderFile(path.join(__dirname, '../views/user/', 'invoice.ejs'), { order })
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(file)
    await page.emulateMediaType('screen')
    await page.pdf({
      path: `./public/invoice/${order._id}.pdf`,
      format: 'A4',
      printBackground: true
    })
    await browser.close()
    next()
  } catch (error) {
    console.log(error)
    res.redirect(`/orders/${req.params.id}`)
  }
}

const salesPdf = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ isCancelled: false }).populate('userId').sort({ createdAt: -1 })
    const file = await ejs.renderFile(path.join(__dirname, '../views/admin/orders/', 'sales.ejs'), { orders })
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(file)
    await page.emulateMediaType('screen')
    await page.pdf({
      path: './public/files/salesReport.pdf',
      format: 'A4',
      printBackground: true,
      landscape: true
    })
    await browser.close()
    next()
  } catch (error) {
    console.log(error)
    res.redirect(`/orders/${req.params.id}`)
  }
}

const salesReportPdf = async (req, res, next) => {
  try {
    console.log(req.session.fromm)
    console.log(req.session.too)
    const from = req.session.fromm
    const to = req.session.too
    const orders = await orderModel.aggregate([
      {
        $match: {
          isCancelled: false,
          $and: [
            { createdAt: { $gte: new Date(from) } },
            { createdAt: { $lte: new Date(to) } }
          ]
        }
      }, {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      }, {
        $unwind: {
          path: '$userId'
        }
      }, {
        $sort: {
          createdAt: 1
        }
      }
    ])
    console.log(orders)
    const file = await ejs.renderFile(path.join(__dirname, '../views/admin/orders/', 'sales.ejs'), { orders })
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(file)
    await page.emulateMediaType('screen')
    await page.pdf({
      path: './public/files/salesReport.pdf',
      format: 'A4',
      printBackground: true,
      landscape: true
    })
    await browser.close()
    next()
  } catch (error) {
    console.log(error)
    res.redirect(`/orders/${req.params.id}`)
  }
}

module.exports = { makeInvoice, salesPdf, salesReportPdf }
