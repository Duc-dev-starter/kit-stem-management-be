const { default: mongoose } = require("mongoose");
const { UserRoleEnum, HttpStatus, PurchaseStatusEnum, PURCHASE_STATUS_CHANGE_PAIRS } = require("../consts");
const { itemsQuery, formatPaginationData, isEmptyObject } = require("../utils");
const { Purchase } = require("../models");
const HttpException = require("../exception");

const purchaseService = {
    getPurchases: async (model, user) => {
        const userId = user.id;
        const { searchCondition, pageInfo } = model;
        const { purchase_no, cart_no, product_id, product_type, status, is_deleted, staff_id } = searchCondition;
        const { pageNum, pageSize } = pageInfo;

        let query = {};

        if (purchase_no) {
            const keywordValue = purchase_no.toLowerCase().trim();
            query = {
                ...query,
                purchase_no: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (cart_no) {
            const keywordValue = cart_no.toLowerCase().trim();
            query = {
                ...query,
                cart_no: { $regex: keywordValue, $options: 'i' },
            };
        }
        console.log(staff_id);


        if (product_id) {
            const keywordValue = product_id.toLowerCase().trim();
            query = {
                ...query,
                product_id: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (product_type) {
            const keywordValue = product_type.toLowerCase().trim();
            query = {
                ...query,
                product_type: { $regex: keywordValue, $options: 'i' },
            };
        }

        if (user.role === UserRoleEnum.CUSTOMER) {
            const userIdObj = new mongoose.Types.ObjectId(userId);
            query = {
                ...query,
                user_id: userIdObj,
            };
        } else if (user.role === UserRoleEnum.STAFF) {
            const staffIdObj = new mongoose.Types.ObjectId(staff_id)
            query = {
                ...query,
                staff_id: staffIdObj,
            };
        }

        query = itemsQuery(query, { status, is_deleted });

        const purchases = await Purchase.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_info'
                }
            },
            {
                $unwind: {
                    path: '$user_info',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'kits',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong kits
                    as: 'product_info_kit'
                }
            },
            {
                $lookup: {
                    from: 'labs',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong labs
                    as: 'product_info_lab'
                }
            },
            {
                $lookup: {
                    from: 'combos',
                    localField: 'product_id', // so sánh với product_id trong purchases
                    foreignField: '_id', // so sánh với _id trong combos
                    as: 'product_info_combo'
                }
            },
            // Thêm unwind cho các product_info
            {
                $unwind: {
                    path: '$product_info_kit',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$product_info_lab',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$product_info_combo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    purchase_no: 1,
                    status: 1,
                    price_paid: 1,
                    price: 1,
                    discount: 1,
                    cart_id: 1,
                    product_id: 1,
                    product_type: 1,
                    user_id: 1,
                    created_at: 1,
                    updated_at: 1,
                    user_name: '$user_info.name',
                    product_name: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ['$product_type', 'kit'] },
                                    then: { $ifNull: ['$product_info_kit.name', 'Unknown Kit'] }
                                },
                                {
                                    case: { $eq: ['$product_type', 'lab'] },
                                    then: { $ifNull: ['$product_info_lab.name', 'Unknown Lab'] }
                                },
                                {
                                    case: { $eq: ['$product_type', 'combo'] },
                                    then: { $ifNull: ['$product_info_combo.name', 'Unknown Combo'] }
                                }
                            ],
                            default: 'Unknown Product'
                        }
                    }
                }
            },
            { $skip: (pageNum - 1) * pageSize },
            { $limit: pageSize }
        ]).sort({ updated_at: -1 });

        console.log(purchases);

        const rowCount = await Purchase.find(query).countDocuments().exec();

        return formatPaginationData(purchases, pageNum, pageSize, rowCount);
    },

    updatePurchaseStatus: async (model, user) => {
        if (isEmptyObject(model) || !Array.isArray(model.purchase_ids) || model.purchase_ids.length === 0) {
            throw new HttpException(HttpStatus.BadRequest, 'Model data is empty or purchase_ids is invalid');
        }

        // Lặp qua từng purchase_id để cập nhật trạng thái
        for (const purchaseId of model.purchase_ids) {
            const purchaseExists = await Purchase.findById(purchaseId);
            if (!purchaseExists) {
                throw new HttpException(HttpStatus.NotFound, `Purchase '${purchaseId}' not found`);
            }

            if (purchaseExists.status === PurchaseStatusEnum.COMPLETED) {
                throw new HttpException(HttpStatus.BadRequest, `Purchase '${purchaseExists.purchase_no}' already completed!`);
            }

            const isValidChangeStatus = PURCHASE_STATUS_CHANGE_PAIRS.some(
                (pair) => pair[0] === purchaseExists.status && pair[1] === model.status,
            );

            if (!isValidChangeStatus) {
                throw new HttpException(
                    HttpStatus.BadRequest,
                    `Invalid status change. Current purchase item '${purchaseExists.purchase_no}' cannot update status: ${purchaseExists.status} -> ${model.status}`,
                );
            }

            // Cập nhật trạng thái và gán staff_id cho từng purchase
            switch (user.role) {
                case 'manager':
                    if (purchaseExists.status === PurchaseStatusEnum.NEW) {
                        purchaseExists.status = PurchaseStatusEnum.PROCESSING; // Chuyển trạng thái
                        purchaseExists.staff_id = model.staff_id; // Gán staff_id từ model vào purchase
                        purchaseExists.assigned_at = Date.now(); // Thời gian gán
                    } else {
                        throw new HttpException(HttpStatus.BadRequest, `Purchase '${purchaseExists.purchase_no}' cannot be processed. Manager can only change from new to processing`);
                    }
                    break;

                case 'staff':
                    console.log('test')
                    if (purchaseExists.status === PurchaseStatusEnum.PROCESSING) {
                        purchaseExists.status = PurchaseStatusEnum.DELIVERING;
                    } else {
                        throw new HttpException(HttpStatus.BadRequest, `Purchase '${purchaseExists.purchase_no}' cannot be delivered. Staff can only change from processing to delivering`);
                    }
                    break;

                case 'customer':
                    if (purchaseExists.status === PurchaseStatusEnum.DELIVERING) {
                        purchaseExists.status = PurchaseStatusEnum.DELIVERED;
                    } else {
                        throw new HttpException(HttpStatus.BadRequest, `Purchase '${purchaseExists.purchase_no}' cannot be marked as delivered. Client can only change from delivering to delivered`);
                    }
                    break;

                default:
                    throw new HttpException(HttpStatus.BadRequest, 'Invalid role or status');
            }

            await purchaseExists.save(); // Lưu từng purchase sau khi cập nhật
        }

        return true;
    },





}

module.exports = purchaseService;