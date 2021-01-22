<template>
    <div>
      <el-table :data="tableData" style="width: 100%"  border >

        <el-table-column label="商品ID" prop="id"  align="center">
        </el-table-column>

        <el-table-column label="商品名称" prop="name"  align="center">
        </el-table-column>

        <el-table-column label="标题" prop="title"  align="center">
        </el-table-column>

        <el-table-column label="商品介绍" prop="productdecs"  align="center">
        </el-table-column>

        <el-table-column label="分类" prop="peopertyId"  align="center">
        </el-table-column>

        <el-table-column label="品牌" prop="brandId"  align="center">
        </el-table-column>

        <el-table-column align="center"
          prop="imgpath"
          label="图片">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgpath"/>
          </template>
        </el-table-column>

        <el-table-column label="价格" prop="price"  align="center">
        </el-table-column>

        <el-table-column label="库存" prop="stocks"  align="center">
        </el-table-column>

        <el-table-column label="编辑属性信息" align="center" >
          <template slot-scope="scope" >
            <el-button type="info"
                 @click="handleEdit(scope.row.peopertyId, scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>

        <el-table-column label="排序字段" prop="sortNum"  align="center">
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope" >
            <el-button type="warning" plain
              @click="toUpdate(scope.row.id)">修改</el-button>
            <el-button
              type="danger" plain
              @click="handleDelete( scope.row.id)">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="sizes"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="length">
      </el-pagination>
      <el-dialog
        title="修改商品属性信息" :model="updatePeopertyForm"
        :visible.sync="updatePeopertyFormFlag" width="40%">
  <el-form ref="peopertyAdd" :model="peopertyAdd" label-width="80px" >
    <el-form-item label="商品类型" prop="typeId">
      <el-select v-model="peopertyAdd.typeId" placeholder="请选择分类" @change="selectChange">
        <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>


    <el-form-item v-model="peopertyAdd.peopertyId" v-if="skuData.length>0" label="商品sku" prop="peopertyId">

      <el-form-item v-for="a in  skuData" :key="a.id" :label="a.peopertyName">

        <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
        <el-select v-if="a.peopertyType==0" v-model="a.ckValues" placeholder="请选择">
          <el-option v-for="item in a.values" :key="item.id"  :label="item.peopertyName" :value="item.nameCh"></el-option>
        </el-select>

        <el-radio-group  v-if="a.peopertyType==1" v-model="a.ckValues">
          <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
        </el-radio-group>

        <el-checkbox-group  v-if="a.peopertyType==2" v-model="a.ckValues" @change="skuChange">
          <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" ></el-checkbox>
        </el-checkbox-group>

        <el-input v-if="a.peopertyType==3"></el-input>
      </el-form-item>


    </el-form-item>

    <el-table
      v-if="tableShow"
      :data="tableSkuData"
      style="width: 100%" >
      <!--   动态展示列头  sku属性中文名 -->
      <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
      </el-table-column>

      <el-table-column
        label="库存"
        width="180">

        <template slot-scope="scope">
          <el-input v-model="scope.row.kuCun"/>
        </template>

      </el-table-column>
      <el-table-column
        label="价格"
        width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jiaGe"/>
        </template>
      </el-table-column>
    </el-table>




    <el-form-item v-model="peoper" v-if="notSkuData.length>0" label="商品属性" prop="peopertyId">

      <el-form-item v-for="a in  notSkuData" :key="a.id" :label="a.peopertyName">
        <template slot-scope="scope">
          <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
          <el-select v-if="a.peopertyType==0" v-model="a.ckValues" placeholder="请选择">
            <el-option v-for="item in a.values" :key="item.id"  :label="a.ckValues" :value="item.nameCh"></el-option>
          </el-select>

          <el-radio-group  v-if="a.peopertyType==1" v-model="a.ckValues">
            <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
          </el-radio-group>

          <el-checkbox-group  v-if="a.peopertyType==2"  v-model="a.ckValues" >
            <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" name="type"></el-checkbox>
          </el-checkbox-group>
          <!--  @change="notSkuChange"-->
          <el-input v-if="a.peopertyType==3" v-model="a.ckValues"></el-input>
        </template>
      </el-form-item>
    </el-form-item>
    <!--<el-button type="primary" @click="addProduct">添加</el-button>-->
  </el-form>

      </el-dialog>

      <el-dialog
        title="修改商品信息" :model="updateShopForm"
        :visible.sync="updateFormFlag" width="40%">
        <el-form :model="updateShopForm" ref="addCarForm"   label-width="80px">

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="updateShopForm.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="updateShopForm.title" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="updateShopForm.brandId" placeholder="请选择分类" @change="selectChange">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序字段" prop="sortNum">
            <el-input-number v-model="updateShopForm.sortNum"  ></el-input-number>
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input-number v-model="updateShopForm.price"  ></el-input-number>
          </el-form-item>

          <el-form-item label="库存" prop="stocks">
            <el-input-number v-model="updateShopForm.stocks"  :step="1" :min="0" :max="1000"></el-input-number>
          </el-form-item>

          <el-form-item label="图片" prop="imgpath">
            <img  :src="updateShopForm.imgpath" class="avatar" width="50px">
            <el-upload
              class="upload-demo"
              action="http://localhost:8080/api/brand/load"
              :on-success="imgCallBack"
              name="img"
              list-type="picture">
              <el-button plain type="primary">点击上传</el-button>

              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品介绍" prop="productdecs">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="updateShopForm.productdecs">
            </el-input>
          </el-form-item>

        </el-form>
        <el-button @click="updateFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="updateShop">确 定</el-button>
      </el-dialog>


    </div>
</template>
<style scoped>

</style>
<script>
    export default {
        name: "Shop",
        data(){
          return{
            tableData:[],//表格的数据
            page:0,
            sizes:[2,3,5,10],
            limit:2,
            length:0,//分页的数据
            updateShopForm:{},//修改商品弹框的值
            brandData:[],//商品的品牌下拉框
            TypeData:[],//商品的类型下拉框
            updateFormFlag:false,//修改商品信息的弹框
            updatePeopertyFormFlag:false,//修改商品属性的弹框
            updatePeopertyForm:{},//修改商品属性的值
            peopertyId:"",
            imgpath:"",
            skuData:[],//sku属性
            notSkuData:[],//非sku属性
            peopertyAdd:{},//商品类型
            tableShow:false,
            peoper:{},     //商品属性
            tableSkuData:[],//动态表头对应的表格数据
            cols:[],//动态表头
            sk:{},//非sku 选中的值
            kuCun:"",
            jiaGe:"",
            xia:"",
            dan:""
          }
        },methods: {
        imgCallBack: function (response, file, fileList) { //图片上传的回调函数
          // 赋值
          this.updateShopForm.imgpath = response.data;
        },
        handleCurrentChange(page) {
          this.queryData(page);
        },
        handleSizeChange: function (limit) { //跳转页面
          this.limit = limit;
          this.queryData(1);
        },
        toUpdate(id) {
          this.brandData = [];
          /* this.TypeData=[];*/
          this.updateFormFlag = true;
          this.$axios.get("http://localhost:8080/api/shop/quertyShopById?id=" + id).then(rs => {
            this.updateShopForm = rs.data;

            this.getBrandData();
          }).catch(err => console.log("修改异常"))
        },
        updateShop() {
          this.$axios.post("http://localhost:8080/api/shop/updateShop", this.$qs.stringify(this.updateShopForm)).then(rs => {
            //关闭弹框，重新查询
            this.updateFormFlag = false;
            this.queryData(1);
          }).catch(error => {
            console.log("修改失败")
          })
        },
        handleDelete(id) {
          this.$axios.delete("http://localhost:8080/api/shop/deleteShop?id=" + id).then(rs => {
            this.queryData(1);
          }).catch(err => {
            console.log("删除失败")
          })
        },
        getBrandData() {
          this.$axios.get("http://localhost:8080/api/brand/queryAllBrandData").then(rs => {
            this.brandData = rs.data;
          }).catch(err => {
            console.log("查询品牌信息失败")
          });
        },//查询品牌的下拉框
        getTypeData() {
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs => {
            //定义的数据     TypeDatas 等于查询出来的所有数据
            this.TypeDatas = rs.data.data;
            //查看有没有子节点数据
            this.getChildrenType();
            for (let i = 0; i < this.TypeData.length; i++) {
              this.typeName = "";
              this.diGui(this.TypeData[i]);
              //给name重新赋值
              this.TypeData[i].name = this.typeName.split("/").reverse().join("/").substr(0, this.typeName.length - 1);

            }
          }).catch(err => {
            console.log("查询类型失败")
          })
        },
        diGui(node) {
          if (node.pid != 0) { //临界值
            this.typeName += "/" + node.name;
            //上级节点
            for (let i = 0; i < this.TypeDatas.length; i++) {
              if (node.pid == this.TypeDatas[i].id) {
                this.diGui(this.TypeDatas[i]);
                break;
              }
            }

          } else {
            this.typeName += "/" + node.name;
          }
        },//查询类型的下拉框
        getChildrenType: function () {
          //遍历所有的节点数据
          for (let i = 0; i < this.TypeDatas.length; i++) {
            //节点中所有数据的一条
            let node = this.TypeDatas[i];
            //判断有没有子节点
            this.isChildrenNode(node);
          }
        },
        isChildrenNode: function (node) {
          let rs = true; //标示
          for (let i = 0; i < this.TypeDatas.length; i++) {
            //如果数据的id有指向所有数据的pid 证明是下面还有节点的
            if (node.id == this.TypeDatas[i].pid) {
              rs = false;
              break;
            }
          }
          if (rs == true) {
            //将数据放到表中需要的字段中
            this.TypeData.push(node);
          }
        },
        queryData(page) {
          this.$axios.get("http://localhost:8080/api/shop/quertyShopData?limit=" + this.limit + "&page=" + page).then(rs => {
            this.tableData = rs.data.data;
            this.length = rs.data.count;
          }).catch(err => console.log("加载商品列表失败"))
        },
        handleEdit(peopertyId, pid) {
          /*console.log(peopertyId, pid);*/
          this.updatePeopertyFormFlag = true;
          this.getTypeData();
          this.peopertyAdd.typeId = peopertyId;//回显分类的下拉框
          this.selectChange(peopertyId, pid);//回显属性数据  peopertyId 类型的id      id就是属性值表的proId
          //回显table
          this.skuChange();
        },
        skuChange() {

          //笛卡尔积的参数
          let kdej = [];
          //清空表格数据
          this.tableSkuData = [];
          //清空动态表头数据
          this.cols = [];
          //判断是否要生成笛卡尔积
          let flag = true;
          //遍历sku所有数据
          for (let i = 0; i < this.skuData.length; i++) {
            //将sku属性 放入动态表头中
            this.cols.push({
              "id": this.skuData[i].id,
              "nameCH": this.skuData[i].peopertyName,
              "name": this.skuData[i].peopertyId
            });
            //将此属性选中的选项值放入笛卡尔积参数中
            //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
            kdej.push(this.skuData[i].ckValues);
            //判断此sku的复选框是否为选中
            if (this.skuData[i].ckValues.length == 0) {
              flag = false;
              break;
            }
          }
          if (flag == true) {
            /*debugger;*/
            let datas = this.calcDescartes(kdej);
            for (let i = 0; i < datas.length; i++) {
              //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]
              //笛卡尔积 转为json的对象
              let jsonData = {}; //笛卡尔积 转为json的对象
              for (let j = 0; j < datas[i].length; j++) {
                //获取数据的key
                let key = this.cols[j].name;
                jsonData[key] = datas[i][j]

              }
              this.tableSkuData.push(jsonData);
            }
            /*console.log(this.tableSkuData);*/
            /*console.log(datas);*/
          }
          this.tableShow = flag;
        },
        calcDescartes: function (array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
        },//笛卡尔积
        selectChange(peopertyId, pid) {
          //先查找到类型所对应的数据
          this.$axios.get("http://localhost:8080/api/shopProduct/queryShopProductByProId?proId=" + pid).then(rs => {
            let peopertyData = rs.data;
            /* console.log(rs.data);*/
            this.notSkuData = [];
            this.skuData = [];
            this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyByTypeId?typeId=" + peopertyId).then(rs => {
              let attrDatas = rs.data;
              /* console.log(attrDatas);*/

              if (attrDatas.length > 0) {
                for (let i = 0; i < attrDatas.length; i++) {
                  if (attrDatas[i].isSku == 0) {
                    if (attrDatas[i].peopertyType != 3) {
                       /* 0 下拉框     1 单选框      2  复选框   3  输入框  */
                      debugger;
                      if (attrDatas[i].peopertyType == 2) {
                        if (this.getValeu(attrDatas[i].peopertyId, peopertyData) == "") {
                          attrDatas[i].ckValues=[];
                        }else{
                          attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                        }
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                      }
                      //发送请求，查询此属性所对应的属性值
                      this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+attrDatas[i].id).then(rs=>{
                        attrDatas[i].values=rs.data;
                            /*console.log(rs.data.data);*/
                        this.skuData.push(attrDatas[i]);//skuData
                      })


                    }else{
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                      this.skuData.push(attrDatas[i]);//skuData
                    }
                  }else{
                    if(attrDatas[i].peopertyType!=3){
                      //回显
                      if(attrDatas[i].peopertyType==2){
                        if(this.getValeu(attrDatas[i].peopertyId,peopertyData)==""){
                          attrDatas[i].ckValues=[];
                        }else{
                          attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                        }
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                      }
                      //发起请求 查询此属性对应的选项值
                      this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+attrDatas[i].id).then(rs=>{
                        attrDatas[i].values=rs.data;
                        // debugger;
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].peopertyId,peopertyData);
                        this.notSkuData.push(attrDatas[i]);//notSkuData
                      })
                    }else{
                      attrDatas[i].ckValues=[];
                      this.notSkuData.push(attrDatas[i]);//notSkuData
                    }
                  }
                }
              }
              else{
                this.skuData=[];
                this.notSkuData=[];
              }
            });
           /* console.log(this.notSkuData);
            console.log(this.skuData);*/

          })
        },
        getValeu: function (key, data) {
          let arrValue = [];
          debugger;
          for (let i = 0; i < data.length; i++) {
            let objData = JSON.parse(data[i].attrData);
            if (objData[key] != null) {
              if(data[i].stockss!=null){
                if(arrValue.indexOf(objData[key])==-1){
                  arrValue.push(objData[key]);
                  console.log(arrValue);
                }

              }else{
                return objData[key];
              }
            }
          }
          return arrValue;
        }
      },
      created(){
          this.queryData(1);
      }
    }
</script>


