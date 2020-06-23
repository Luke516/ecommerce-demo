export function translate(text) {
    let dict = {
        "All Products": "所有商品",
        "Electronics": "電子產品",
        "Luggage": "行李",
        "Men's Fashion": "男性時尚",
        "Women's Fashion": "女性時尚",
        "Health and Household": "健康",
        "Home and Kitchen": "居家生活",
        "Beauty and Personal Care":"美妝護理",
        "Television & Video":"電視",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",
        "":"",

    }
    if(text in dict){
        return dict[text]
    }
    else{
        return text;
    }
}
  