<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column align="center" width="80px" prop="id" type="index" label="序号">
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称">
            </el-table-column>
            <el-table-column prop="logo" label="品牌LOGO">
                <template slot-scope="{row,$index}">
                    <img :src="row.logo">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateBrank(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top:20px; text-align:center" :current-page="page" :page-size="limit"
            :page-count="7" :page-sizes="[3, 5, 1]" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" layout="prev, pager, next,jumper,->,sizes,total">
        </el-pagination>

        <!-- 对话框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="brandFrom" :rules="rules" ref="ruleForm" style="width:80%">
                <el-form-item label="品牌名称" prop="brandName" label-width="100px">
                    <el-input v-model="brandFrom.brandName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" prop="logo" label-width="100px">
                    <el-upload class="avatar-uploader" action='http://127.0.0.1:9999/admin/common/file/fileUpload'
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="brandFrom.logo" :src="brandFrom.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateBrand">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reqAddOrUpdateBrand } from '@/api/product/brand';

export default {
    name: 'tradeMark',
    data() {
        var validatebrandName = (rule, value, callback) => {
            if (value.length < 2 || value.length > 10) {
                callback(new Error("品牌名称2-10位"));
            } else {
                callback();
            }
        };
        return {
            // 当前页
            page: 1,
            // 每页展示条数
            limit: 3,
            // 总条数
            total: 0,
            // 数据集
            list: [],
            // 表单展示按钮
            dialogFormVisible: false,
            // 上传图像
            imageUrl: '',
            // 表单标题
            title: "",
            // 对话框数据
            brandFrom: {
                id: "",
                brandName: "",
                logo: ""
            },
            rules: {
                brandName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    // { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'change' }
                    // 自定义校验规则
                    { validator: validatebrandName, trigger: "change" }
                ],
                logo: [
                    { required: true, message: '请选择品牌图片' },
                ],
            },
        }
    },
    mounted() {
        this.getPageList();
    },
    methods: {
        async getPageList() {
            const { page, limit } = this
            let result = await this.$API.brand.reqBrandList(page, limit);
            if (result.code === 0) {
                this.total = result.data.count
                this.list = result.data.list
            }
        },

        // 修改当前页码
        handleCurrentChange(pager) {
            this.page = pager
            this.getPageList()
        },

        // 修改每页展示条数
        handleSizeChange(limit) {
            this.limit = limit
            this.getPageList()
        },

        // 点击添加品牌对话框
        showDialog() {
            this.title = "添加品牌"
            this.dialogFormVisible = true;
            this.brandFrom = { brandName: "", logo: "" }
        },

        // 修改品牌
        updateBrank(row) {
            this.title = "修改品牌"
            this.dialogFormVisible = true;
            this.brandFrom = { ...row };
        },

        // 上传图片回调
        handleAvatarSuccess(res, file) {
            this.brandFrom.logo = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {

            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isExt = true

            if (!isJPG && !isPNG) {
                isExt = false
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }

            return isExt && isLt2M;
        },

        addOrUpdateBrand() {
            this.$refs.ruleForm.validate(async (success) => {
                if (success) {
                    this.dialogFormVisible = false;

                    // 发请求（添加品牌|修改品牌）
                    let result = await this.$API.brand.reqAddOrUpdateBrand(this.brandFrom);
                    if (result.code === 0) {
                        // 弹出信息
                        this.$message({
                            type: 'success',
                            message: this.brandFrom.id ? '修改品牌成功' : '添加品牌成功'
                        });
                        // 添加或修改品牌成功以后，需要再次获取品牌列表
                        this.getPageList();
                    }
                } else {
                    console.log("error submit!");
                    return false;
                }
            })
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>